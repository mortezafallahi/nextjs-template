// init.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// مسیر فایل‌های کلیدی
const packageJsonPath = path.join(__dirname, 'package.json');
const envExamplePath = path.join(__dirname, '.env.example');
const envLocalPath = path.join(__dirname, '.env.local');
const initScriptPath = __filename;

// رابط برای خواندن ورودی از کاربر
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const color = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;
const green = (text) => color(text, 32);
const yellow = (text) => color(text, 33);
const cyan = (text) => color(text, 36);

async function main() {
  console.log(cyan('🚀 شروع آماده‌سازی پروژه جدید...'));

  // ۱. دریافت نام پروژه از کاربر
  const projectName = await new Promise((resolve) => {
    rl.question(
      yellow('نام پروژه جدید شما چیست؟ (مثال: my-awesome-app) '),
      resolve
    );
  });
  rl.close();

  if (!projectName) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'نام پروژه نمی‌تواند خالی باشد. اسکریپت متوقف شد.'
    );
    process.exit(1);
  }

  // ۲. آپدیت نام پروژه در package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = projectName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(green('✅ `package.json` با موفقیت آپدیت شد.'));

  // ۳. تنظیم متغیرهای محیطی
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log(
      green('✅ فایل `.env.local` با موفقیت از روی `.env.example` ساخته شد.')
    );
    console.log(yellow('🔔 یادت نره که مقادیر داخل `.env.local` رو پر کنی!'));
  }

  // ۴. نصب وابستگی‌ها
  console.log(cyan('\n⏳ در حال نصب وابستگی‌ها با pnpm...'));
  execSync('pnpm install', { stdio: 'inherit' });
  console.log(green('✅ وابستگی‌ها با موفقیت نصب شدند.'));

  // ۵. پاک‌سازی فایل‌های غیرضروری
  fs.unlinkSync(initScriptPath);
  console.log(green('✅ اسکریپت `init.js` حذف شد.'));

  console.log(green('\n🎉 پروژه شما با موفقیت آماده شد!'));
  console.log('حالا می‌تونی با دستور `pnpm dev` سرور رو اجرا کنی.');
}

main().catch(console.error);
