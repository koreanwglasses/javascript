adder = {
    a: null,
    b: null,
    sum: function() {
        return this.a + this.b;
    },
    printsum: function () {
        console.log(this.sum());
    }
}

a = 1;
b = 2;

adder.a = a;
adder.b = a;

adder.printsum(); // Prints 2

sum = adder.sum;
a = sum();

adder.a = a;
adder.b = b;

adder.printsum(); // Prints ?