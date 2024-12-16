from manim import *

class InterpretedVsCompiled(Scene):
    def construct(self):
        # Setup title
        title = Text("Interpreted vs Compiled Languages").scale(0.75)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Create source code representations
        python_code = Code(
            code='def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)',
            language="python",
            font_size=20
        ).shift(LEFT * 4 + UP)

        cpp_code = Code(
            code='int factorial(int n) {\n    if (n <= 1)\n        return 1;\n    return n * factorial(n-1);\n}',
            language="cpp",
            font_size=20
        ).shift(LEFT * 4 + DOWN * 2)

        # Create labels for code
        python_label = Text("Python (Interpreted)", font_size=20).next_to(python_code, UP)
        cpp_label = Text("C++ (Compiled)", font_size=20).next_to(cpp_code, UP)

        # Create paths
        interpreted_path = Line(python_code.get_right(), RIGHT * 4 + UP)
        compiled_path = Line(cpp_code.get_right(), RIGHT * 4 + DOWN * 2)
        
        # Create execution steps for interpreted
        interpret_steps = VGroup(
            Text("Read --> ", font_size=16),
            Text("Parse --> ", font_size=16),
            Text("Execute", font_size=16)
        ).arrange(RIGHT, buff=0.1).next_to(interpreted_path, UP, buff=0.2)

        # Create execution steps for compiled
        compile_steps = VGroup(
            Text("Compile --> ", font_size=16),
            Text("Link --> ", font_size=16),
            Text("Run Binary", font_size=16)
        ).arrange(RIGHT, buff=0.1).next_to(compiled_path, DOWN, buff=0.2)

        # Show only Python (interpreted) first
        self.play(
            Create(python_code),
            Write(python_label)
        )
        self.wait(1)

        # Show interpreted path and steps
        self.play(Create(interpreted_path))
        self.play(Write(interpret_steps))

        # Animate interpreted dot
        interp_dot = Dot(color=GREEN)
        interp_dot.move_to(python_code.get_right())
        self.play(Create(interp_dot))
        self.play(MoveAlongPath(interp_dot, interpreted_path), run_time=1)
        self.play(interp_dot.animate.set_color(RED))
        
        # Show interpreted timing label
        interpreted_time = Text("No Compilation Needed\nSlower Execution", font_size=16, color=RED).next_to(interpreted_path, RIGHT)
        self.play(Write(interpreted_time))
        self.wait(1)

        # Now show C++ (compiled) path
        self.play(
            Create(cpp_code),
            Write(cpp_label)
        )
        self.wait(1)

        # Show compiled path and steps
        self.play(Create(compiled_path))
        self.play(Write(compile_steps))

        # Animate compiled dot
        comp_dot = Dot(color=YELLOW)
        comp_dot.move_to(cpp_code.get_right())
        self.play(Create(comp_dot))
        self.play(MoveAlongPath(comp_dot, compiled_path), run_time=2)
        self.play(comp_dot.animate.set_color(GREEN))

        # Show compiled timing label
        compiled_time = Text("Compilation needed\nFaster execution", font_size=16, color=GREEN).next_to(compiled_path, RIGHT)
        self.play(Write(compiled_time))
        self.wait(2)
