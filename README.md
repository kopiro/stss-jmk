# STSS.jmk

### Alloy.JMK to compile [STSS](https://www.npmjs.org/package/stss) files with [TiShadow](https://www.npmjs.org/package/tishadow).

Open your terminal, `cd` to your **Titanium** project.

```
if [ ! -f app/alloy.jmk ]; then
	wget https://raw.githubusercontent.com/kopiro/STSS.jmk/master/alloyjmk.js -O app/alloy.jmk
else
	echo "app/alloy.jmk file exists, please merge with 'https://raw.githubusercontent.com/kopiro/STSS.jmk/master/alloyjmk.js'"
fi
```