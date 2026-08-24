#!/usr/bin/env python3
"""tinyloader crack — implements the RC4 scheme read out of shs3.swf's `lb` class.

Scheme (from decompiled lb.as, frame-1 handler):
    key      = payload[len-8 : len]            # last 8 bytes of the blob ITSELF
    n        = min(64, len(payload))           # ONLY the first 64 bytes are encrypted
    RC4-KSA over key, then PRGA XOR into payload[0:n]

Everything after byte 64 is plaintext. This is header-only obfuscation.
"""
import sys, zlib, struct, pathlib

def rc4_decrypt_prefix(buf: bytearray, key: bytes, nbytes: int = 64) -> bytearray:
    n = min(nbytes, len(buf))
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) & 0xFF
        S[i], S[j] = S[j], S[i]
    i = j = 0
    out = bytearray(buf)
    for k in range(n):
        i = (i + 1) & 0xFF
        j = (j + S[i]) & 0xFF
        t = S[i]
        S[i], S[j] = S[j], S[i]
        out[k] ^= S[(t + S[i]) & 0xFF]
    return out

def describe(head: bytes) -> str:
    sig = head[:3]
    if sig in (b'FWS', b'CWS', b'ZWS'):
        ver = head[3]
        ln = struct.unpack('<I', head[4:8])[0]
        return f"*** REAL SWF *** sig={sig.decode()} version={ver} fileLength={ln}"
    return f"not a SWF: {head[:8].hex(' ')}"

def try_file(path: pathlib.Path, keylen: int = 8, nbytes: int = 64):
    raw = bytearray(path.read_bytes())
    print(f"\n=== {path.name}  ({len(raw):,} bytes) ===")
    print(f"  before: {describe(bytes(raw[:8]))}")
    key = bytes(raw[len(raw) - keylen:])
    print(f"  key (last {keylen} bytes): {key.hex(' ')}")
    dec = rc4_decrypt_prefix(raw, key, nbytes)
    print(f"  after : {describe(bytes(dec[:8]))}")
    return dec

def extract_binarydata(swf_path: pathlib.Path):
    """Walk an uncompressed-or-CWS SWF and yield (characterId, bytes) per DefineBinaryData."""
    raw = swf_path.read_bytes()
    if raw[:3] == b'CWS':
        body = zlib.decompress(raw[8:])
    elif raw[:3] == b'FWS':
        body = raw[8:]
    else:
        raise ValueError('unknown sig')
    # skip rect
    nbits = body[0] >> 3
    rect_bits = 5 + 4 * nbits
    p = (rect_bits + 7) // 8
    p += 4  # frame rate + frame count
    out = []
    while p < len(body):
        (rec,) = struct.unpack_from('<H', body, p); p += 2
        tag, ln = rec >> 6, rec & 0x3F
        if ln == 0x3F:
            (ln,) = struct.unpack_from('<I', body, p); p += 4
        data = body[p:p + ln]; p += ln
        if tag == 87:  # DefineBinaryData: u16 charId + u32 reserved + data
            cid = struct.unpack_from('<H', data, 0)[0]
            out.append((cid, data[6:]))
        if tag == 0:
            break
    return out

if __name__ == '__main__':
    base = pathlib.Path(__file__).resolve().parents[1]  # reference/
    pres = base / 'preservation'
    outdir = base / 'decrypted'
    outdir.mkdir(exist_ok=True)

    # 1) the two blobs embedded inside shs3.swf
    for cid, blob in extract_binarydata(pres / 'shs3.swf'):
        p = outdir / f'shs3_binarydata_{cid}.bin'
        p.write_bytes(blob)
        print(f"extracted BinaryData chid={cid} -> {p.name} ({len(blob):,} bytes)")

    # 2) attack every candidate
    targets = [
        outdir / 'shs3_binarydata_9.bin',
        pres / 'shs3_payload.swf',
        pres / 'shs3_android_payload.swf',
        pres / 'shs3preloader.swf',
    ]
    for t in targets:
        if not t.exists():
            print(f"\n=== {t.name}: MISSING ===")
            continue
        dec = try_file(t)
        if bytes(dec[:3]) in (b'FWS', b'CWS', b'ZWS'):
            op = outdir / (t.stem + '_decrypted.swf')
            op.write_bytes(dec)
            print(f"  WROTE {op}")
