# ChangeLog #

## 0.1.1 - February 1, 2013 ##
* Lexer must reach the end of the stream or else if will fail. Before, it lexed
  as much of the stream as possible. Note that for lazy streams, the stream
  may fail for any token and this error must be handled correctly when pulling
  values from the lex stream.

## 0.1.0 - February 10, 2013 ##
* Initial release.