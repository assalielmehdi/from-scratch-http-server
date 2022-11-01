import { test } from 'tap';
import { Cookie } from '../lib/cookie';
import { CTL_CHARS, SEPARATOR_CHARS } from '../lib/format.util';

test('Cookie module', async (t) => {
  t.test('Validation', async (t) => {
    const tests: { cookie: any, shouldPass: boolean, description: string }[] = [{
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          maxAge: 12,
          domain: 'correct.domain-value'
        }
      },
      shouldPass: true,
      description: 'Should pass'
    }];

    // cookie.name failing tests
    tests.push({
      cookie: {
        name: '',
        value: '',
      },
      shouldPass: false,
      description: 'Should not pass: Name should not be empty'
    });

    CTL_CHARS.forEach((ctlChar) => tests.push({
      cookie: {
        name: `na${ctlChar}me`,
        value: '',
      },
      shouldPass: false,
      description: 'Should not pass: Name should not contain a CTL char'
    }));

    SEPARATOR_CHARS.forEach((sepChar) => tests.push({
      cookie: {
        name: `na${sepChar}me`,
        value: '',
      },
      shouldPass: false,
      description: 'Should not pass: Name should not contain a SEPARATOR char'
    }));

    // cookie.value failing tests
    CTL_CHARS.forEach((ctlChar) => tests.push({
      cookie: {
        name: 'name',
        value: `val${ctlChar}ue`,
      },
      shouldPass: false,
      description: 'Should not pass: Value should not contain a CTL char'
    }));

    tests.push({
      cookie: {
        name: 'name',
        value: 'val ue',
      },
      shouldPass: false,
      description: 'Should not pass: Value should not contain a whitespace char'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'val"ue',
      },
      shouldPass: false,
      description: 'Should not pass: Value should not contain a double-quote char'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'val,ue',
      },
      shouldPass: false,
      description: 'Should not pass: Value should not contain a comma char'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'val;ue',
      },
      shouldPass: false,
      description: 'Should not pass: Value should not contain a semicolon char'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'val\\ue',
      },
      shouldPass: false,
      description: 'Should not pass: Value should not contain a backslash char'
    });

    // cookie.options.maxAge failing tests
    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          maxAge: 0
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option max-age should be strictly positive'
    });

    // cookie.options.domain failing tests
    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          domain: ''
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option domain should not be empty'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          domain: Array(255 + 1).map(() => 'x').join('')
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option domain should not be of length greater that 255'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          domain: '.domain'
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option domain should not begin with a dot char'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          domain: 'domain.'
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option domain should not end with a dot char'
    });

    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          domain: 'domain.w/.$pecial.cha-racters'
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option domain should not contain special chars'
    });

    // cookie.options.path failing tests
    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          path: 'path;'
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option path should not contain a semicolon char'
    });

    CTL_CHARS.forEach((ctlChar) => {
      tests.push({
        cookie: {
          name: 'name',
          value: 'value',
          options: {
            path: `pa${ctlChar}th`
          }
        },
        shouldPass: false,
        description: 'Should not pass: Option path should not contain a CTL char'
      });
    });

    // cookie.options.extension failing tests
    tests.push({
      cookie: {
        name: 'name',
        value: 'value',
        options: {
          extension: 'extension;'
        }
      },
      shouldPass: false,
      description: 'Should not pass: Option extension should not contain a semicolon char'
    });

    CTL_CHARS.forEach((ctlChar) => {
      tests.push({
        cookie: {
          name: 'name',
          value: 'value',
          options: {
            extension: `exte${ctlChar}nsion`
          }
        },
        shouldPass: false,
        description: 'Should not pass: Option extension should not contain a CTL char'
      });
    });

    tests.forEach(({ cookie, description, shouldPass }) => t.test(description, async (t) => {
      const underTest = () => {
        new Cookie(cookie.name, cookie.value, cookie.options);
      };

      if (shouldPass) {
        t.doesNotThrow(underTest);
      } else {
        t.throws(underTest);
      }
    }));
  });
});
