# ベースイメージ
FROM --platform=linux/arm64/v8 ghcr.io/kodansha/bedrock:php8.2-fpm

ENV WEB_ROOT /var/www/html

RUN apt-get update && apt-get install -y \
    locales \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN sed -i -E 's/# (ja_JP.UTF-8)/\1/' /etc/locale.gen \
    && locale-gen
ENV LANG ja_JP.UTF-8

# Custom PHP configuration
RUN { \
    echo 'memory_limit = 128M'; \
    echo 'post_max_size = 96M'; \
    echo 'upload_max_filesize = 64M'; \
    echo 'max_execution_time = 3600'; \
    echo 'max_input_time = 3600'; \
    echo ''; \
    echo '[mbstring]'; \
    echo 'mbstring.language = "Japanese"'; \
    } > /usr/local/etc/php/conf.d/custom-app.ini

WORKDIR ${WEB_ROOT}

ENV COMPOSER_ALLOW_SUPERUSER 1

# Install PHP package dependencies
COPY --chown=www-data:www-data composer.json composer.lock ${WEB_ROOT}/
RUN composer install

# Copy application source codes
COPY --chown=www-data:www-data . ${WEB_ROOT}

# Fix all permissions
RUN chown -R www-data:www-data ${WEB_ROOT}

VOLUME ${WEB_ROOT}
