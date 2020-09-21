rtl_fm -f 162.4M -M fm -F 0 -E dc -g 42 -s 22050 - | stdbuf -oL -eL multimon-ng -t raw -a EAS /dev/stdin
## Next line is for testing.
#sox ./WXR-RWT.ogg -esigned-integer -b16 -r 22050 -t raw - | stdbuf -oL -eL multimon-ng -t raw -a EAS /dev/stdin

