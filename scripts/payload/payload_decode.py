#!/usr/bin/env python3
"""Decode shs3_payload.swf — transform read verbatim out of the stage-3 preloader
(`shs3preloader_fla.MainTimeline`, method §1t136s0§, called from onComplete with key=104).

    var i:int = 3;
    while (i < 256) {
        if (i % 11 == 0) { t = b[i]; b[i] = b[i+256]; b[i+256] = t; }
        b[i] ^= key;                       // key = 104 = 0x68
        i++;
    }

Bytes 0..2 are never touched -> the "CWS" signature survives, which is exactly why
the archived file looked like a SWF with a bogus version byte. Byte 3 becomes
0x79 ^ 0x68 = 0x11 = 17, i.e. CWS v17.
Only the first 512 bytes are involved at all; everything past byte 511 is plaintext.
"""
import struct, sys, zlib, pathlib

KEY = 104

def decode(buf: bytes, key: int = KEY) -> bytearray:
    b = bytearray(buf)
    for i in range(3, 256):
        if i % 11 == 0:
            b[i], b[i + 256] = b[i + 256], b[i]
        b[i] ^= key
    return b

def describe(head: bytes) -> str:
    if head[:3] in (b'FWS', b'CWS', b'ZWS'):
        return (f"*** REAL SWF *** sig={head[:3].decode()} version={head[3]} "
                f"fileLength={struct.unpack('<I', head[4:8])[0]:,}")
    return f"not a SWF: {head[:8].hex(' ')}"

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        p = pathlib.Path(arg)
        raw = p.read_bytes()
        print(f"\n=== {p.name} ({len(raw):,} bytes) ===")
        print(f"  before: {describe(raw[:8])}")
        dec = decode(raw)
        print(f"  after : {describe(bytes(dec[:8]))}")
        if bytes(dec[:3]) in (b'FWS', b'CWS', b'ZWS'):
            # prove it: actually inflate the body
            try:
                body = zlib.decompress(bytes(dec[8:])) if dec[:3] == b'CWS' else bytes(dec[8:])
                print(f"  PROOF : zlib body inflates to {len(body):,} bytes "
                      f"(header claims {struct.unpack('<I', bytes(dec[4:8]))[0]:,})")
            except Exception as e:
                print(f"  WARN  : body did not inflate cleanly: {e}")
            op = p.parent.parent / 'decrypted' / (p.stem + '_decoded.swf')
            op.parent.mkdir(exist_ok=True)
            op.write_bytes(dec)
            print(f"  WROTE {op}")
