# WebUSB CP2102

Simple WebUSB CP2102 communication library.

Useful for reading cp2102-equiped device data from Android devices.

Supported browsers (systems) - https://caniuse.com/webusb


### Example

Live demo - https://calcite.github.io/WebUSB-CP2102/example/

```javascript
import usbCp2102 from '@alcz/webusb-cp2102';

const esp = new usbCp2102({});
esp.connect().then(async () => {
  await esp.initialize();

  const receive = async () => {
    const data = await esp.read();
    const s = String.fromCharCode.apply(null, new Uint8Array(data))
    console.log(s);
    receive();
  }
  receive();
});
```

### Usage

No settings needed on chrome for android (tested on Pixel 4).

To run this lib on linux:

##### Set udev rule

e.g. create `/etc/udev/rules.d/50-chromusb.rules`

`SUBSYSTEM=="usb", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", GROUP="dialout", MODE="0660"`

##### Add user to dialout

`sudo usermod -a -G dialout $USER `

##### Temporarily disable cp210x module

`sudo modprobe -r cp210x`


---

Based on [GitHub gist](https://gist.github.com/nuta/2c70ba8855f50c536a51f0c5993c1e4c) shared by [Seiya Nuta](https://github.com/nuta).
