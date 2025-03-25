// components/TranslatedText.js
import React from 'react';
import { Text } from 'react-native';
import { t } from '../i18n';

/**
 * A component that renders translated text
 * @param {string} textKey - The translation key
 * @param {object} options - Optional parameters for the translation
 * @param {object} props - Other Text props
 */
const TranslatedText = ({ textKey, options, style, ...props }) => {
  return (
    <Text style={style} {...props}>
      {t(textKey, options)}
    </Text>
  );
};

export default TranslatedText;