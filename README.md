# Bigbrain

[![build status](https://github.com/dqn/bigbrain/workflows/build/badge.svg)](https://github.com/dqn/bigbrain/actions)

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
    // => fizzbuzz
  } else if (i % 3 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
    // => fizz
  } else if (i % 5 == 0) {
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
    // => buzz
  } else {
    print(i);
  }
  putchar(10);
  // => \n
}
```

Output:

```
>>,>++<[>[>+>+<<-]>>[<<+>>-]<<<-]>[-]>[<<+>>-]<<<<[-]>>[<<+>>>+<-]>...
```

## Features

### variable

```
// initialize variable
foo = 10;
bar = 20;
```

### input

```
// input returns integer
x = input();
```

### print

```
// print value as decimal
print(10); // => 10
```

### putchar

```
// print value as character
putchar(65); // => A
```

### block

```
// block is an expression
x = { 12 };

y = {
  print(10);
  putchar(65);

  // if there is no semicolon, the value is returned
  20 + 15 + 7
};

print(y); // => 42
```

### if-else

The body must be a block.

```
x = 20;

// if only
if (x > 10) {
  print(65);
}

// if-else
if (x > 10) {
  print(65);
} else {
  print(66);
}

// if-else, if...
if (x > 10) {
  print(65);
} else if (x < 10) {
  print(66);
} else {
  print(67);
}

// if-else is an expression
y = if (x > 10) {
  1
} else {
  2
};

print(y); // => 1
```

### for

The body must be a block.

```
for (i = 0; i < 10; i++) {
  print(i % 3);
}
```

### operators

Support for basic operators.

```
print(1 + +1); // => 2
print(1 + -1); // => 0
print(1 + 2); // => 3
print(4 - 1); // => 3
print(2 * 4); // => 8
print(2 ** 3); // => 8
print(13 / 3); // => 4
print(13 % 3); // => 1
print(2 * (3 + 4)); // => 14
print(!0); // => 1
print(1 == 2); // => 0
print(1 != 2); // => 1
print(1 < 2); // => 1
print(1 > 2); // => 0
print(1 <= 1); // => 1
print(1 >= 1); // => 1
print(1 && 0); // => 0
print(1 || 0); // => 1

x = 5;
print(++x); // => 6
print(x++); // => 6
print(x--); // => 7
print(--x); // => 5
```

## License

MIT
