from manim import *

config.media_width = "100%"
config.verbosity = "WARNING"

class TokenizerProcess(Scene):
    def construct(self):
        # Title
        title = Text("Understanding a Tokenizer", font_size=48, color=YELLOW)
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))

        # Code box on the left
        code_text = Text("let x = (5*4)/2;", font_size=30)
        code_box = SurroundingRectangle(code_text, color=BLUE)
        code_group = VGroup(code_box, code_text).to_edge(LEFT)
        
        # Lexer box in the center
        lexer_text = Text("Lexer", font_size=36, color=WHITE)
        lexer_box = SurroundingRectangle(lexer_text, color=GREEN)
        lexer_group = VGroup(lexer_box, lexer_text).move_to(ORIGIN)

        self.play(Create(code_box), Write(code_text))
        self.wait(1)

        left_line = Arrow(start=code_group.get_right(), end=lexer_group.get_left(), color=YELLOW)
        self.play(Create(left_line))
        self.wait(0.5)


        self.play(Create(lexer_box), Write(lexer_text))
        self.wait(1)

        # Add explanation
        explanation = Text(
            "The lexer takes code as input and produces tokens as output.",
            font_size=30,
        )
        explanation.next_to(lexer_group, DOWN)
        self.play(Write(explanation))
        self.wait(3)
        self.play(FadeOut(explanation)) # Hide explanation

        # Tokens box on the right
        
        tokens_text = Text(
            "Tokens:\nKeyword: 'let'\nIdentifier: 'x'\nOperator: '='\n"
            "Left Parenthesis: '('\nNumber: '5'\nOperator: '*'\nNumber: '4'\n"
            "Right Parenthesis: ')'\nOperator: '/'\nNumber: '2'\nSemicolon: ';'",
            font_size=24,
            line_spacing=0.5,
        )
        tokens_box = SurroundingRectangle(tokens_text, color=RED)
        tokens_group = VGroup(tokens_box, tokens_text).to_edge(RIGHT)

        right_line = Arrow(start=lexer_group.get_right(), end=tokens_group.get_left(), color=YELLOW)
        self.play(Create(right_line))
        self.wait(1)

        self.play(Create(tokens_box), Write(tokens_text))
        self.wait(3)

        # Cleanup
        self.play(
            FadeOut(title),
            FadeOut(code_group),
            FadeOut(lexer_group),
            FadeOut(tokens_group),
            FadeOut(left_line),
            FadeOut(right_line),
        )
