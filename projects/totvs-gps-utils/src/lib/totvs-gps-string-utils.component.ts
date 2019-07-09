/**
 * Classe para manipulação de strings
 */

interface MaskResult {
  valid: boolean;
  result: string;
}

export interface TotvsMaskOptions {
  reverse?: boolean;
  useDefaults?: boolean;
}

export class TotvsMaskString {

  private pattern: string;
  private options: TotvsMaskOptions;

  constructor(pattern?: string, opt?: TotvsMaskOptions) {
    this.options = opt || {};
    this.options = {
      reverse: this.options.reverse || false,
      useDefaults: this.options.useDefaults || this.options.reverse
    };
    this.pattern = pattern || '';
  }

  public static getInstance(pattern?: string, opt?: TotvsMaskOptions): TotvsMaskString {
    let obj = new TotvsMaskString(pattern, opt);
    return obj;
  }

  private tokens = {
    '0': { pattern: /\d/, _default: '0' },
    '9': { pattern: /\d/, optional: true },
    '#': { pattern: /\d/, optional: true, recursive: true },
    'A': { pattern: /[a-zA-Z0-9]/ },
    'S': { pattern: /[a-zA-Z]/ },
    'U': { pattern: /[a-zA-Z]/, transform: function (c) { return c.toLocaleUpperCase(); } },
    'L': { pattern: /[a-zA-Z]/, transform: function (c) { return c.toLocaleLowerCase(); } },
    '$': { escape: true }
  };

  private isEscaped(pattern, pos) {
    var count = 0;
    var i = pos - 1;
    var token = { escape: true };
    while (i >= 0 && token && token.escape) {
      token = this.tokens[pattern.charAt(i)];
      count += token && token.escape ? 1 : 0;
      i--;
    }
    return count > 0 && count % 2 === 1;
  }

  private calcOptionalNumbersToUse(pattern, value) {
    var numbersInP = pattern.replace(/[^0]/g, '').length;
    var numbersInV = value.replace(/[^\d]/g, '').length;
    return numbersInV - numbersInP;
  }

  private concatChar(text, character, options, token) {
    if (token && typeof token.transform === 'function') {
      character = token.transform(character);
    }
    if (options.reverse) {
      return character + text;
    }
    return text + character;
  }

  private hasMoreTokens(pattern, pos, inc) {
    var pc = pattern.charAt(pos);
    var token = this.tokens[pc];
    if (pc === '') {
      return false;
    }
    return token && !token.escape ? true : this.hasMoreTokens(pattern, pos + inc, inc);
  }

  private hasMoreRecursiveTokens(pattern, pos, inc) {
    var pc = pattern.charAt(pos);
    var token = this.tokens[pc];
    if (pc === '') {
      return false;
    }
    return token && token.recursive ? true : this.hasMoreRecursiveTokens(pattern, pos + inc, inc);
  }

  private insertChar(text, char, position) {
    var t = text.split('');
    t.splice(position, 0, char);
    return t.join('');
  }

  private proccess(value): MaskResult {
    if (!value) {
      return <MaskResult>{ result: '', valid: false };
    }
    value = value + '';
    var pattern2 = this.pattern;
    var valid = true;
    var formatted = '';
    var valuePos = this.options.reverse ? value.length - 1 : 0;
    var patternPos = 0;
    var optionalNumbersToUse = this.calcOptionalNumbersToUse(pattern2, value);
    var escapeNext = false;
    var recursive = [];
    var inRecursiveMode = false;

    var steps = {
      start: this.options.reverse ? pattern2.length - 1 : 0,
      end: this.options.reverse ? -1 : pattern2.length,
      inc: this.options.reverse ? -1 : 1
    };

    let continueCondition = (options) => {
      if (!inRecursiveMode && !recursive.length && this.hasMoreTokens(pattern2, patternPos, steps.inc)) {
        // continue in the normal iteration
        return true;
      }
      else if (!inRecursiveMode && recursive.length &&
        this.hasMoreRecursiveTokens(pattern2, patternPos, steps.inc)) {
        // continue looking for the recursive tokens
        // Note: all chars in the patterns after the recursive portion will be handled as static string
        return true;
      }
      else if (!inRecursiveMode) {
        // start to handle the recursive portion of the pattern
        inRecursiveMode = recursive.length > 0;
      }

      if (inRecursiveMode) {
        var pc = recursive.shift();
        recursive.push(pc);
        if (options.reverse && valuePos >= 0) {
          patternPos++;
          pattern2 = this.insertChar(pattern2, pc, patternPos);
          return true;
        }
        else if (!options.reverse && valuePos < value.length) {
          pattern2 = this.insertChar(pattern2, pc, patternPos);
          return true;
        }
      }
      return patternPos < pattern2.length && patternPos >= 0;
    }


    /**
     * Iterate over the pattern's chars parsing/matching the input value chars
     * until the end of the pattern. If the pattern ends with recursive chars
     * the iteration will continue until the end of the input value.
     *
     * Note: The iteration must stop if an invalid char is found.
     */
    for (patternPos = steps.start; continueCondition(this.options); patternPos = patternPos + steps.inc) {
      // Value char
      var vc = value.charAt(valuePos);
      // Pattern char to match with the value char
      var pc = pattern2.charAt(patternPos);

      var token = this.tokens[pc];
      if (recursive.length && token && !token.recursive) {
        // In the recursive portion of the pattern: tokens not recursive must be seen as static chars
        token = null;
      }

      // 1. Handle escape tokens in pattern
      // go to next iteration: if the pattern char is a escape char or was escaped
      if (!inRecursiveMode || vc) {
        if (this.options.reverse && this.isEscaped(pattern2, patternPos)) {
          // pattern char is escaped, just add it and move on
          formatted = this.concatChar(formatted, pc, this.options, token);
          // skip escape token
          patternPos = patternPos + steps.inc;
          continue;
        }
        else if (!this.options.reverse && escapeNext) {
          // pattern char is escaped, just add it and move on
          formatted = this.concatChar(formatted, pc, this.options, token);
          escapeNext = false;
          continue;
        } 
        else if (!this.options.reverse && token && token.escape) {
          // mark to escape the next pattern char
          escapeNext = true;
          continue;
        }
      }

      // 2. Handle recursive tokens in pattern
      // go to next iteration: if the value str is finished or
      //                       if there is a normal token in the recursive portion of the pattern
      if (!inRecursiveMode && token && token.recursive) {
        // save it to repeat in the end of the pattern and handle the value char now
        recursive.push(pc);
      } 
      else if (inRecursiveMode && !vc) {
        // in recursive mode but value is finished. Add the pattern char if it is not a recursive token
        formatted = this.concatChar(formatted, pc, this.options, token);
        continue;
      } 
      else if (!inRecursiveMode && recursive.length > 0 && !vc) {
        // recursiveMode not started but already in the recursive portion of the pattern
        continue;
      }

      // 3. Handle the value
      // break iterations: if value is invalid for the given pattern
      if (!token) {
        // add char of the pattern
        formatted = this.concatChar(formatted, pc, this.options, token);
        if (!inRecursiveMode && recursive.length) {
          // save it to repeat in the end of the pattern
          recursive.push(pc);
        }
      }
      else if (token.optional) {
        // if token is optional, only add the value char if it matchs the token pattern
        //                       if not, move on to the next pattern char
        if (token.pattern.test(vc) && optionalNumbersToUse) {
          formatted = this.concatChar(formatted, vc, this.options, token);
          valuePos = valuePos + steps.inc;
          optionalNumbersToUse--;
        } 
        else if (recursive.length > 0 && vc) {
          valid = false;
          break;
        }
      } 
      else if (token.pattern.test(vc)) {
        // if token isn't optional the value char must match the token pattern
        formatted = this.concatChar(formatted, vc, this.options, token);
        valuePos = valuePos + steps.inc;
      } 
      else if (!vc && token._default && this.options.useDefaults) {
        // if the token isn't optional and has a default value, use it if the value is finished
        formatted = this.concatChar(formatted, token._default, this.options, token);
      } 
      else {
        // the string value don't match the given pattern
        valid = false;
        break;
      }
    }

    return <MaskResult>{ result: formatted, valid: valid };
  };

  public setPattern(pattern: string) {
    this.pattern = pattern;
  }

  public setOptions(opt: TotvsMaskOptions) {
    this.options = opt;
  }

  public apply(value: string): string {
    return this.proccess(value).result;
  }

  public validate(value: string): boolean {
    return this.proccess(value).valid;
  }
  
}

export class TotvsStringUtils {
  
  public getSeparators(text:String):string{
    if(text){
      if(text.includes('/')){
        return '/';
      }
      if(text.includes(";")){
        return ';';
      }
      if(text.includes("\\")){
        return '\\';
      }
      if(text.includes('-')){
        return '-';
      }
      if(text.includes(',')){
        return ',';
      }
    }        
    return "/";
  }

}
