$(function () {
    FormValidation.Validator.securePassword = {
        validate: function (validator, $field, options) {
            var default_options = {
                min: 8,
                requireUpperCase: true,
                requireLowerCase: true,
                requireNumber: true,
                requireSpecial: false,
            };
            options = $.extend(true, default_options, options);

            var value = $field.val();
            if (value === '') {
                return true;
            }

            // Check the password strength
            if (value.length < options.min) {
                return {
                    valid: false,
                    message: 'The password must be more than ' + options.min + ' characters long.'
                };
            }

            // The password doesn't contain any uppercase character
            if (options.requireUpperCase && value === value.toLowerCase()) {
                return {
                    valid: false,
                    message: 'The password must contain at least one upper case character.'
                }
            }

            // The password doesn't contain any uppercase character
            if (options.requireLowerCase && value === value.toUpperCase()) {
                return {
                    valid: false,
                    message: 'The password must contain at least one lower case character.'
                }
            }

            // The password doesn't contain any digit
            if (options.requireNumber && value.search(/[0-9]/) < 0) {
                return {
                    valid: false,
                    message: 'The password must contain at least one digit.'
                }
            }

            // The password doesn't contain any special character
            if (options.requireSpecial) {
                var p = /[\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\?\<\>\|\.]/;
                if (!p.test(value))
                {
                    return {
                        valid: false,
                        message: 'The password must contain at least one special character.'
                    }
                }
            }

            return true;
        }
    };

    FormValidation.Validator.thaiCitizenNumber = {
        validate: function (validator, $field, options) {
            var value = $field.val();
            if (value === '') {
                return true;
            }

            // Check the number length
            if (value.length !== 13) {
                return {
                    valid: false,
                    //message: 'The Thai citizen identifier number must be 13 characters long.'
                    message: 'เลขบัตรประชาชน ต้องมี 13 หลัก'
                };
            }

            if (!/^\d{13}$/.test(value)) {
                return {
                    valid: false,
                    //message: 'The Thai citizen identifier number must be numeric only.'
                    message: 'เลขบัตรประชาชน ต้องเป็นตัวเลขเท่านั้น'
                };
            }

            var x = 0;
            for (var i = 0; i < value.length - 1; i++) {
                x += value[i] * (13 - i);
            }
            x = (11 - (x % 11)) % 10;
            if (value[12] != x) {
                return {
                    valid: false,
                    //message: 'The Thai citizen identifier number is not valid.',
                    message: 'เลขบัตรประชาชนไม่ถูกต้อง',
                };
            }

            return true;
        },
    };

    FormValidation.Validator.ajaxExists = {
        validate: function (validator, $field, options) {
            var default_options = {
                minLength: 0,
                async: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            };
            options = $.extend(true, default_options, options);

            var value = $field.val();
            if (value === '') {
                return true;
            }

            if (options.minLength > 0 && value.length < options.minLength) {
                return true;
            }

            var data = options.data || {};
            if ('function' === typeof data) {
                data = data.call(this, validator, $field, value);
            }

            var result = null;
            options = $.extend(true, options, {
                data: data,
                success: function (data, status, xhr) {
                    if (data == null || data.length == 0) {
                        result = true;
                    } else {
                        result = {
                            valid: false,
                            message: options.message,
                        }
                    }
                },
            });
            $.ajax(options);

            return result;
        }
    };

    FormValidation.Validator.thaiPostalCode = {
        validate: function (validator, $field, options) {
            var default_options = {
                messages: {
                    invalidLength: 'The Thai postal code must be 5 characters long.',
                    invalidFormat: 'The Thai postal code must be numeric only (10000 - 99999).',
                },
            };
            options = $.extend(true, default_options, options);

            var value = $field.val();
            if (value === '') {
                return true;
            }

            // Check the number length
            if (value.length !== 5) {
                return {
                    valid: false,
                    message: options.message || options.messages.invalidLength,
                };
            }

            if (!/^[1-9]\d{4}$/.test(value)) {
                return {
                    valid: false,
                    message: options.message || options.messages.invalidFormat,
                };
            }

            return true;
        },
    };

    FormValidation.Validator.stringFixedLength = {
        validate: function (validator, $field, options) {
            var default_options = {
                length: 10,
                message: 'The value must be %s characters long',
            };
            options = $.extend(true, default_options, options);

            var value = $field.val();
            if (value === '') {
                return true;
            }

            // Check the number length
            if ($.trim(value).length !== options.length) {
                return {
                    valid: false,
                    message: FormValidation.Helper.format(options.message, options.length),
                };
            }

            return true;
        },
    };

});
