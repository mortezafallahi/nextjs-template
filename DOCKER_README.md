# SharifHealth Docker Setup

این راهنما برای راه‌اندازی پروژه SharifHealth با Docker است.

## پیش‌نیازها

- Docker
- Docker Compose

## راه‌اندازی

### 1. توسعه (Development)

```bash
# Build و اجرای پروژه
docker-compose up --build

# اجرا در background
docker-compose up -d --build
```

### 2. تولید (Production)

```bash
# اجرا با nginx reverse proxy
docker-compose --profile production up -d --build
```

## دستورات مفید

```bash
# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down

# حذف کامل (شامل volumes)
docker-compose down -v

# rebuild کردن
docker-compose build --no-cache

# مشاهده وضعیت سرویس‌ها
docker-compose ps
```

## پورت‌ها

- **3000**: اپلیکیشن اصلی (Next.js)
- **80**: HTTP (redirect به HTTPS)
- **443**: HTTPS (فقط در production)

## متغیرهای محیطی

فایل `.env` را در root پروژه ایجاد کنید:

```env
NODE_ENV=production
PORT=3000
```

## SSL/HTTPS

برای production، فایل‌های SSL را در پوشه `ssl/` قرار دهید:

```bash
mkdir ssl
# فایل‌های cert.pem و key.pem را در این پوشه قرار دهید
```

سپس در `nginx.conf` خطوط مربوط به SSL را uncomment کنید.

## Health Check

اپلیکیشن در آدرس `/health` در دسترس است:

```bash
curl http://localhost/health
```

## Troubleshooting

### مشکل در Build
```bash
# پاک کردن cache
docker system prune -a
docker-compose build --no-cache
```

### مشکل در Port
```bash
# بررسی پورت‌های استفاده شده
netstat -tulpn | grep :3000
```

### مشکل در Permissions
```bash
# تغییر ownership فایل‌ها
sudo chown -R $USER:$USER .
```

## ساختار فایل‌ها

```
├── docker-compose.yml    # تنظیمات Docker Compose
├── Dockerfile           # Docker image configuration
├── nginx.conf          # Nginx reverse proxy config
├── .dockerignore       # فایل‌های نادیده گرفته شده
└── DOCKER_README.md    # این فایل
```

## نکات امنیتی

1. **SSL**: حتماً SSL را برای production فعال کنید
2. **Rate Limiting**: nginx rate limiting فعال است
3. **Security Headers**: headers امنیتی در nginx تنظیم شده
4. **Environment Variables**: فایل‌های .env را در .gitignore قرار دهید

## Monitoring

```bash
# مشاهده resource usage
docker stats

# مشاهده لاگ‌های nginx
docker-compose logs nginx

# مشاهده لاگ‌های اپلیکیشن
docker-compose logs sharifhealth
``` 