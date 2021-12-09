/*
Yoinked from YarnEditor source and modified to limit size and scope:

https://github.com/YarnSpinnerTool/YarnEditor/blob/master/src/js/classes/data.js

Including as a dependency would not tree-shake well and would be subject to breakage, so we copy it instead.

--------------

Copyright (c) 2015 Infinite Ammo Inc. and Yarn Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export default function convertYarn (content) {
  const objects = []
  var lines = content.split(/\r?\n/)
  var obj = null
  var readingBody = false
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '===') {
      readingBody = false
      if (obj != null) {
        if (!obj.tags) obj.tags = ''
        objects.push(obj)
        obj = null
      }
    } else if (readingBody) {
      obj.body += lines[i] + '\n'
    } else {
      if (lines[i].trim() === '---') {
        readingBody = true
        obj.body = ''
      } else if (lines[i].indexOf(':') > -1) {
        const [key, value] = lines[i].split(':')
        if (key !== 'body') {
          if (obj == null) obj = {}
          obj[key] = value.trim()
        }
      }
    }
  }
  if (obj != null) {
    if (!obj.tags) obj.tags = ''
    objects.push(obj)
  }
  return objects
}
