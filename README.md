# Bigbrain

High-level programming language that can be compiled to Brainfuck.

## Example

```
x = input() * 2;

for (i = 1; i <= x; ++i) {
  if (i % 3 == 0 && i % 5 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
  } else if (i % 3 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
  } else if (i % 5 == 0) {
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
  } else {
    print(i);
  }
  putchar(10);
}
```

Output:

```
>>,>++<[>[>+>+<<-]>>[<<+>>-]<<<-]>[-]>[<<+>>-]<<<<[-]>>[<<+>>>+<-]>...
```

## License

MIT
