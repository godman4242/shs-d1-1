#!/usr/bin/env python3
"""SWF Defender (magichtml.com) unwrapper.

Config layout read straight out of the decompiled `la` class
(method §\t\n\n\x0b\x18\t\r\r\x18\x1b\x18§), in order:

  u32 magic/version, u32 width, u32 height, u8 level,
  u16 keyLen, key[keyLen],
  u16 domainsLen, domains (UTF, "!=!=!"-separated),
  u8 allowLocal, u8 showDomainMsg, u8 doNavigate,
  u16 urlLen, url[urlLen],
  u32 msgColor, u8 ?, u16 msgLen, msg[msgLen],
  u8 showWatermark, u8 showLogo, [u32 logoX, u32 logoY, u32 logoAlpha],
  u8 password, [u16+hash, u16+text, u16+submit, u16+invalid],
  ...rest = PROTECTED PAYLOAD

Then: level 0 -> Comp.C1 (repeating-key XOR), level 1 -> Comp.C2 (RC4),
both over the FIRST 64 BYTES ONLY.
"""
import struct, zlib, pathlib, sys

def c1_xor(buf, key, n=64):
    out = bytearray(buf); k = 0
    for i in range(min(n, len(out))):
        out[i] ^= key[k]
        k = 0 if k + 1 >= len(key) else k + 1
    return out

def c2_rc4(buf, key, n=64):
    out = bytearray(buf)
    S = list(range(256)); j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) & 0xFF
        S[i], S[j] = S[j], S[i]
    i = j = 0
    for k in range(min(n, len(out))):
        i = (i + 1) & 0xFF
        j = (j + S[i]) & 0xFF
        t = S[i]
        S[i], S[j] = S[j], S[i]
        out[k] ^= S[(t + S[i]) & 0xFF]
    return out

def swf_body(raw):
    if raw[:3] == b'CWS':  return zlib.decompress(raw[8:])
    if raw[:3] == b'FWS':  return raw[8:]
    if raw[:3] == b'ZWS':  raise ValueError('LZMA SWF unsupported here')
    raise ValueError(f'not a SWF: {raw[:8].hex()}')

def binarydatas(path):
    body = swf_body(pathlib.Path(path).read_bytes())
    nbits = body[0] >> 3
    p = (5 + 4 * nbits + 7) // 8 + 4
    out = []
    while p < len(body):
        (rec,) = struct.unpack_from('<H', body, p); p += 2
        tag, ln = rec >> 6, rec & 0x3F
        if ln == 0x3F:
            (ln,) = struct.unpack_from('<I', body, p); p += 4
        data = body[p:p+ln]; p += ln
        if tag == 87:
            out.append((struct.unpack_from('<H', data, 0)[0], data[6:]))
        if tag == 0: break
    return out

class R:
    def __init__(self, b): self.b, self.p = b, 0
    def u8(self):  v = self.b[self.p]; self.p += 1; return v
    def u16(self): v = struct.unpack_from('<H', self.b, self.p)[0]; self.p += 2; return v
    def u32(self): v = struct.unpack_from('<I', self.b, self.p)[0]; self.p += 4; return v
    def raw(self, n): v = self.b[self.p:self.p+n]; self.p += n; return v
    def s(self, n): return self.raw(n).decode('utf-8', 'replace')

def parse_config(blob):
    r = R(blob); c = {}
    c['magic']  = r.u32()
    c['width']  = r.u32()
    c['height'] = r.u32()
    c['level']  = r.u8()
    c['key']    = r.raw(r.u16())
    dl = r.u16()
    c['domains'] = r.s(dl).split('!=!=!') if dl else []
    c['allowLocal']    = r.u8()
    c['showDomainMsg'] = r.u8()
    c['doNavigate']    = r.u8()
    ul = r.u16()
    c['url'] = r.s(ul) if ul else ''
    c['msgColor'] = r.u32()
    c['u8_after_color'] = r.u8()
    c['msg'] = r.s(r.u16())
    c['showWatermark'] = r.u8()
    c['showLogo'] = r.u8()
    if c['showLogo']:
        c['logoX'], c['logoY'], c['logoAlpha'] = r.u32(), r.u32(), r.u32()
    c['password'] = r.u8()
    if c['password']:
        c['passwordhash']    = r.s(r.u16())
        c['passwordtext']    = r.s(r.u16())
        c['passwordsubmit']  = r.s(r.u16())
        c['passwordinvalid'] = r.s(r.u16())
    c['payload'] = blob[r.p:]
    return c

def unwrap(swf_path, outdir):
    outdir = pathlib.Path(outdir); outdir.mkdir(parents=True, exist_ok=True)
    results = []
    for cid, blob in binarydatas(swf_path):
        try:
            c = parse_config(blob)
        except Exception as e:
            print(f"  chid={cid}: not a config blob ({e})"); continue
        print(f"\n--- chid={cid} SWF Defender config ---")
        for k in ('magic','width','height','level','allowLocal','showDomainMsg',
                  'doNavigate','url','msgColor','msg','showWatermark','showLogo','password'):
            if k in c: print(f"  {k:15s} = {c[k]!r}")
        print(f"  {'key':15s} = {c['key'].hex(' ')}  ({len(c['key'])} bytes)"
              f"  ascii={c['key'].decode('latin1')!r}")
        print(f"  {'domains':15s} = {c['domains']}")
        if c['password']:
            print(f"  {'passwordhash':15s} = {c.get('passwordhash')!r}")
            print(f"  {'passwordtext':15s} = {c.get('passwordtext')!r}")
        print(f"  {'payload':15s} = {len(c['payload']):,} bytes, head={c['payload'][:8].hex(' ')}")
        if c['password']:
            print("  !! PASSWORD-LOCKED: payload key is the user's password, not the stored key.")
            results.append((cid, c, None)); continue
        dec = (c1_xor if c['level'] == 0 else c2_rc4)(c['payload'], c['key'], 64)
        sig = bytes(dec[:3])
        ok = sig in (b'FWS', b'CWS', b'ZWS')
        print(f"  DECRYPT level={c['level']} ({'C1 XOR' if c['level']==0 else 'C2 RC4'}) -> "
              f"{'*** REAL SWF *** ' + sig.decode() + ' v' + str(dec[3]) + ' len=' + str(struct.unpack('<I', bytes(dec[4:8]))[0]) if ok else 'FAILED: ' + dec[:8].hex(' ')}")
        if ok:
            op = outdir / f'{pathlib.Path(swf_path).stem}_chid{cid}_unwrapped.swf'
            op.write_bytes(dec); print(f"  WROTE {op}")
            results.append((cid, c, op))
    return results

if __name__ == '__main__':
    unwrap(sys.argv[1], sys.argv[2])
