const BasePage = require('./base.page');

class OtpVerificationPage extends BasePage {
  get verificationCodeTitle() {
    return $('android=new UiSelector().text("Verification Code")');
  }

  get otpInputs() {
    return $$('android=new UiSelector().className("android.widget.EditText")');
  }

  async waitForLoaded(timeout = 15000) {
    await this.waitFor(this.verificationCodeTitle, timeout);

    await browser.waitUntil(async () => {
      const inputs = await this.otpInputs;
      return inputs.length > 0;
    }, {
      timeout,
      interval: 250,
      timeoutMsg: 'Expected the OTP input fields to be visible.'
    });
  }

  async enterOtp(otp) {
    const sanitizedOtp = String(otp).trim().replace(/\s+/g, '');

    if (!/^\d{6}$/.test(sanitizedOtp)) {
      throw new Error('Expected a 6-digit OTP.');
    }

    const inputs = await this.otpInputs;

    if (inputs.length === 1) {
      await this.type(inputs[0], sanitizedOtp, 5000);
      return;
    }

    if (inputs.length < sanitizedOtp.length) {
      throw new Error(`Expected 6 OTP input fields but found ${inputs.length}.`);
    }

    for (let index = 0; index < sanitizedOtp.length; index += 1) {
      await this.click(inputs[index]);
      await inputs[index].setValue(sanitizedOtp[index]);
    }
  }
}

module.exports = new OtpVerificationPage();
