# Gen Z Programming Language Interpreter

This repository contains the interpreter for the **Gen Z Programming Language**, a fun and quirky language that encapsulates the chaos of Gen Z culture in code. Inspired by brainrot, and the unapologetic essence of iPad kids, this project is both an experiment and a statement.

<p>This was made for a youtube video, you can watch it [here](https://youtu.be/bDhQPRyz8eE).</p>

<div align="center">
  <a href="https://www.youtube.com/watch?v=bDhQPRyz8eE"><img src="https://img.youtube.com/vi/bDhQPRyz8eE/0.jpg" alt="Creating a Gen Z Programming Language That Nobody Asked For"></a>
</div>
---

## Features

-   **Custom Syntax**: Skibidi, grimace, pluh—this language has it all. 🕺
-   **Core Functionalities**:
    -   Variables (mutable and constants)
    -   Basic math operations (+, -, \*, /, %)
    -   Strings and printing with `buss`
    -   Objects and nested objects
    -   Functions (`pluh`) and conditional statements (`fanum` for `if`, `tax` for `else`)

---

## Prerequisites

To run the interpreter, ensure you have the following installed:

-   **Node.js** (v14 or higher)
-   **TypeScript**

---

## How to Run

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/genz-lang.git
    cd genz-lang
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Compile the TypeScript code (optional, if not using `ts-node`):

    ```bash
    tsc
    ```

4. Run the interpreter using the following command:

    ```bash
    ts-node .\src\main.ts .\test\main.skbd
    ```

    Replace `main.skbd` with your own `.skbd` file to test different scripts!

---

## Example Code

Here’s a FizzBuzz example written in the Gen Z Programming Language:

```skbd
pluh fizzbuzz(i) {
    fanum (i % 3 == 0){
        fanum (i % 5 == 0) {
            buss("FizzBuzz")
        } tax {
            buss("Fizz")
        }
    } tax fanum (i % 5 == 0) {
        buss("Buzz")
    } tax {
        buss(i)
    }
}
```

Run it with the interpreter to see it in action! 🎉

---

## Special Thanks To ❤️:

-   **Nufshi**: Video editing help
-   **skyerush.**: Thumbnail help
-   **Yankuutsun (Yolo)**: File format suggestion
-   **Taco**: Emotional Support

---

## License

This project is licensed under the MIT License.

---

## Contribution

Contributions are welcome! Feel free to fork the repository and submit a pull request with your improvements or ideas. 🚀
