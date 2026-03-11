const fs = require('node:fs');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

function createPromptInterface() {
  if (stdin.isTTY && stdout.isTTY) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    return {
      rl,
      close: () => rl.close()
    };
  }

  const terminalPath = process.platform === 'win32' ? 'CON' : '/dev/tty';
  const input = fs.createReadStream(terminalPath);
  const output = fs.createWriteStream(terminalPath);
  const rl = readline.createInterface({ input, output });

  return {
    rl,
    close: () => {
      rl.close();
      input.destroy();
      output.end();
    }
  };
}

async function promptForOtp(message = 'Please enter the OTP from email: ') {
  const promptInterface = createPromptInterface();
  const { rl } = promptInterface;

  try {
    while (true) {
      const otp = (await rl.question(message)).trim();

      if (otp) {
        return otp;
      }

      rl.write('OTP cannot be empty.\n');
    }
  } finally {
    promptInterface.close();
  }
}

module.exports = {
  promptForOtp
};
