class WebUsbCp2102 {
  constructor(options = {}) {
    const defaultSettings = {
      baudRate: 115200,
      interfaceNumber: 0,
      endpointNumber: 2,
      configurationNumber: 1,
      filters: [ { 'vendorId': 0x10c4, 'productId': 0xea60 } ],
      onDisconnect: () => {},
    };
    this.usb = null
    this.settings = { ...defaultSettings, ...options };
  }

  async connect() {
    const filters = this.settings.filters;

    navigator.usb.ondisconnect = this.settings.onDisconnect;

    const devices = await navigator.usb.getDevices()
    if (devices.length > 0) {
      this.usb = devices[0]
    } else {
      this.usb = await navigator.usb.requestDevice({ filters })
    }
  }

  async close() {
    if (this.usb) {
      await this.usb.close();
      navigator.usb.ondisconnect = null;
      this.usb = null;
    }
  }

  async initialize() {
    await this.usb.open();
    console.log('USB device', this.usb);

    await this.usb.selectConfiguration(this.settings.configurationNumber);
    await this.usb.claimInterface(this.settings.interfaceNumber);

    await this.usb.controlTransferOut({
      requestType: 'vendor',
      recipient: 'device',
      request: 0x00,
      index: 0x00,
      value: 0x01
    });

    await this.usb.controlTransferOut({
      requestType: 'vendor',
      recipient: 'device',
      request: 0x07,
      index: 0x00,
      value: 0x03 | 0x0100 | 0x0200
    });

    await this.usb.controlTransferOut({
      requestType: 'vendor',
      recipient: 'device',
      request: 0x01,
      index: 0x00,
      value: 0x384000 / this.settings.baudRate
    });
  }

  async read(length=64) {
    const r = await this.usb.transferIn(this.settings.endpointNumber, length);
    return new Uint8Array(r.data.buffer);
  }

  async write(data) {
    await this.usb.transferIn(this.settings.endpointNumber, data);
  }
}

export default WebUsbCp2102;
