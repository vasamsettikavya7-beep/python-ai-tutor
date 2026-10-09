/**
 * Comprehensive Python Curriculum Knowledge Base
 * Covers all 32 curriculum topics with syntax, code examples, and best practices.
 */

export const TOPIC_KNOWLEDGE_BASE = {
  // ==========================================
  // 1. CORE FUNDAMENTALS
  // ==========================================
  'Variables': {
    title: 'Variables & Assignment in Python',
    summary: 'Variables in Python are dynamically typed reference labels pointing to memory objects.',
    explanation: `In Python, you do not declare variable types explicitly. A variable is created the moment you first assign a value to it using the assignment operator (\`=\`).

\`\`\`python
# Variable declarations
student_name = "Alex"       # str
student_age = 22            # int
gpa = 3.85                  # float
is_enrolled = True          # bool

# Multiple assignment
x, y, z = 10, 20, 30

print(f"{student_name} (Age: {student_age}) - GPA: {gpa}")
\`\`\`

**Key Points:**
- **Naming Rules**: Must begin with a letter or underscore (\`_\`), followed by letters, numbers, or underscores. Cannot use Python reserved keywords.
- **Case-Sensitive**: \`score\` and \`Score\` are two completely distinct variables.
- **PEP 8 Convention**: Use \`snake_case\` for variable and function names.`,
  },

  'Data Types': {
    title: 'Data Types & Type Casting',
    summary: 'Python provides rich built-in types including numeric (int, float, complex), sequence (str, list, tuple), and boolean.',
    explanation: `Python is strongly, dynamically typed. Objects have types, but variable labels do not.

\`\`\`python
# Type inspection
val_int = 42
val_str = "100"
val_float = 3.14159

print(type(val_int))    # <class 'int'>
print(isinstance(val_int, int))  # True

# Type conversion (Casting)
converted_int = int(val_str)      # 100
converted_str = str(val_float)    # "3.14159"
bool_truthy = bool("hello")       # True (non-empty strings are truthy)
bool_falsy = bool(0)              # False
\`\`\`

**Key Points:**
- **Truthy & Falsy**: \`0\`, \`""\`, \`[]\`, \`{}\`, \`None\`, and \`False\` evaluate to \`False\` in conditional expressions.
- Prefer \`isinstance(obj, ClassType)\` over \`type(obj) == ClassType\` to support inheritance.`,
  },

  'Strings': {
    title: 'String Operations & Formatting',
    summary: 'Strings in Python are immutable sequences of Unicode characters with rich manipulation methods.',
    explanation: `Strings can be enclosed in single, double, or triple quotes (for multi-line strings).

\`\`\`python
text = "  Python AI Tutor  "

# String methods
cleaned = text.strip()              # "Python AI Tutor"
words = cleaned.split(" ")          # ["Python", "AI", "Tutor"]
rejoined = "-".join(words)          # "Python-AI-Tutor"
upper_text = cleaned.upper()        # "PYTHON AI TUTOR"

# Modern f-string interpolation
level = "Beginner"
score = 95.5
summary = f"Student Level: {level.upper()} | Score: {score:.1f}%"
print(summary)

# Slicing: [start:stop:step]
phrase = "Programming"
print(phrase[0:4])   # "Prog"
print(phrase[::-1])  # Reverse string: "gnimmargorP"
\`\`\`

**Key Points:**
- **Immutability**: You cannot modify characters directly (\`text[0] = 'J'\` raises \`TypeError\`). Create a new string instead.
- Use **f-strings** (\`f"{var}"\`) for modern, readable string formatting.`,
  },

  'Operators': {
    title: 'Operators & Expressions',
    summary: 'Python supports arithmetic, comparison, logical, membership, and identity operators.',
    explanation: `Operators allow you to perform computations, comparisons, and logical evaluations.

\`\`\`python
# Arithmetic
print(10 // 3)   # Floor division: 3
print(10 % 3)    # Modulo (remainder): 1
print(2 ** 4)    # Exponentiation (2^4): 16

# Comparison & Chaining
x = 15
print(10 < x <= 20)  # Chained comparison: True

# Identity (is) vs Equality (==)
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)    # True (identical values)
print(a is b)    # False (different memory addresses)

# Membership
fruits = ["apple", "banana"]
print("apple" in fruits)      # True
print("cherry" not in fruits) # True
\`\`\`

**Key Points:**
- Use \`==\` to compare **values**, and \`is\` to check **identity / memory address** (commonly used for \`x is None\`).`,
  },

  'Conditions': {
    title: 'Conditional Branching (if / elif / else)',
    summary: 'Control execution flow based on logical expressions and boolean evaluations.',
    explanation: `Conditional statements allow your program to make decisions based on runtime conditions.

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "Needs Practice"

print(f"Final Grade: {grade}")

# Ternary (conditional expression)
status = "Passing" if score >= 70 else "Failing"
print(f"Status: {status}")
\`\`\`

**Key Points:**
- Python uses **indentation** (4 spaces) rather than curly braces to define code blocks.
- You can chain conditions with \`and\`, \`or\`, and \`not\`.`,
  },

  'Loops': {
    title: 'Loops (for & while)',
    summary: 'Iteration constructs for repeating actions over sequences or while conditions hold true.',
    explanation: `Python provides \`for\` loops for definite iteration and \`while\` loops for conditional iteration.

\`\`\`python
# 1. for loop with range(start, stop, step)
for i in range(1, 6):
    print(f"Step {i}: square = {i ** 2}")

# 2. Iterating with enumerate()
languages = ["Python", "JavaScript", "Rust"]
for index, lang in enumerate(languages, start=1):
    print(f"{index}. {lang}")

# 3. while loop with break & continue
count = 5
while count > 0:
    if count == 3:
        count -= 1
        continue  # Skip 3
    print(f"Countdown: {count}")
    count -= 1
\`\`\`

**Key Points:**
- The \`for ... else\` construct: the \`else\` block executes only if the loop finished without encountering a \`break\`.`,
  },

  'Functions': {
    title: 'Functions & Parameter Handling',
    summary: 'Reusable blocks of code with default parameters, variable arguments (*args, **kwargs), and return values.',
    explanation: `Functions allow code modularity, encapsulation, and clean abstraction.

\`\`\`python
def calculate_metrics(base_score: int, *bonuses, multiplier: float = 1.0, **metadata) -> dict:
    """Calculates student score with variable bonuses and metadata."""
    total = (base_score + sum(bonuses)) * multiplier
    return {
        "final_score": round(total, 2),
        "bonuses_applied": len(bonuses),
        "details": metadata
    }

# Function invocation
result = calculate_metrics(80, 5, 10, multiplier=1.1, student="Alex", subject="Python")
print(result)
\`\`\`

**Key Points:**
- \`*args\` collects positional arguments into a \`tuple\`.
- \`**kwargs\` collects keyword arguments into a \`dict\`.
- Use type hints (\`x: int -> str\`) to clarify function contracts.`,
  },

  'Scope': {
    title: 'Variable Scope & the LEGB Rule',
    summary: 'Python resolves variables through four nested scopes: Local, Enclosing, Global, and Built-in.',
    explanation: `Understanding how Python resolves identifiers is essential for preventing unintended variable shadowing.

\`\`\`python
global_var = "Global"

def outer_function():
    enclosing_var = "Enclosing"

    def inner_function():
        nonlocal enclosing_var
        local_var = "Local"
        
        enclosing_var = "Modified Enclosing"
        print(f"{local_var} -> {enclosing_var} -> {global_var}")

    inner_function()
    print("Outer sees:", enclosing_var)

outer_function()
\`\`\`

**Key Points:**
- **LEGB Order**: Python looks for names in **L**ocal first, then **E**nclosing, then **G**lobal, and finally **B**uilt-in.
- Use \`global\` to modify module-level variables and \`nonlocal\` to modify enclosing function variables.`,
  },

  // ==========================================
  // 2. DATA STRUCTURES
  // ==========================================
  'Lists': {
    title: 'Lists: Dynamic Ordered Arrays',
    summary: 'Lists are mutable, ordered sequences supporting dynamic resizing, indexing, slicing, and sorting.',
    explanation: `Lists are Python's workhorse collection for ordered data.

\`\`\`python
items = ["apple", "banana", "cherry"]

# Mutating methods
items.append("date")          # Add to end: ['apple', 'banana', 'cherry', 'date']
items.insert(1, "blueberry")  # Insert at index 1
popped = items.pop()          # Removes and returns last element: "date"
items.sort(key=len)           # In-place sort by length

# Slicing
first_two = items[:2]
reversed_copy = items[::-1]

print("Processed list:", items)
\`\`\`

**Key Points:**
- Append and pop from the end are \(O(1)\) operations; inserting or deleting from the start is \(O(n)\).
- Lists can hold heterogeneous types (\`[1, "hello", True, 3.14]\`).`,
  },

  'Tuples': {
    title: 'Tuples: Immutable Sequences',
    summary: 'Tuples are immutable ordered sequences, ideal for fixed data, dictionary keys, and function return sets.',
    explanation: `Tuples are defined with parentheses and cannot be modified once instantiated.

\`\`\`python
# Tuple creation & unpacking
coordinates = (10, 20)
latitude, longitude = coordinates

# Single-element tuple requires trailing comma
single = (42,)

# Tuples as dict keys (because they are hashable)
locations = {
    (40.7128, -74.0060): "New York",
    (37.7749, -122.4194): "San Francisco"
}

print(locations[(40.7128, -74.0060)])
\`\`\`

**Key Points:**
- Tuples consume less memory and have faster iteration than lists.
- A tuple is immutable, but if it contains a mutable item (like a list), the inner item can still mutate.`,
  },

  'Dictionaries': {
    title: 'Dictionaries: Key-Value Hash Maps',
    summary: 'Dictionaries store key-value associations with average O(1) retrieval, insertion, and deletion.',
    explanation: `Python dictionaries maintain insertion order (since Python 3.7) and offer rich lookup methods.

\`\`\`python
student = {
    "name": "Sarah",
    "course": "Python AI",
    "xp": 350
}

# Safe access with default
streak = student.get("streak", 1)  # Returns 1 without raising KeyError

# Updating
student["level"] = "Intermediate"
student.update({"xp": 400, "verified": True})

# Iteration
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

**Key Points:**
- Keys must be **hashable** (immutable types like strings, numbers, or tuples).
- Always prefer \`.get(key, default)\` over \`dict[key]\` when a key might not exist.`,
  },

  'Sets': {
    title: 'Sets: Unique Unordered Collections',
    summary: 'Sets enforce uniqueness and provide high-performance mathematical operations like union, intersection, and difference.',
    explanation: `Sets use hash tables under the hood, making membership checks (\`x in s\`) average \(O(1)\).

\`\`\`python
python_devs = {"Alice", "Bob", "Charlie", "Alice"}  # Deduplicated automatically
js_devs = {"Charlie", "Diana", "Evan"}

# Set operations
both = python_devs & js_devs          # Intersection: {'Charlie'}
all_devs = python_devs | js_devs      # Union: {'Alice', 'Bob', 'Charlie', 'Diana', 'Evan'}
only_python = python_devs - js_devs   # Difference: {'Alice', 'Bob'}

# Fast deduplication of a list
numbers = [1, 2, 2, 3, 4, 4, 5]
unique_numbers = list(set(numbers))
print("Unique numbers:", unique_numbers)
\`\`\`

**Key Points:**
- Sets cannot contain mutable items like lists or other sets. Use \`frozenset\` for immutable, hashable sets.`,
  },

  'List Comprehensions': {
    title: 'List Comprehensions & Generator Syntax',
    summary: 'Concise, expressive syntax to map, filter, and transform iterables into new lists.',
    explanation: `List comprehensions replace verbose loops with readable single-line expressions.

\`\`\`python
# Syntax: [expression for item in iterable if condition]
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter even numbers and square them
even_squares = [n ** 2 for n in numbers if n % 2 == 0]
print("Even squares:", even_squares)  # [4, 16, 36, 64, 100]

# Dict comprehension
square_dict = {n: n ** 2 for n in range(1, 5)}
print("Dict comprehension:", square_dict)  # {1: 1, 2: 4, 3: 9, 4: 16}
\`\`\`

**Key Points:**
- List comprehensions are generally faster than manual \`.append()\` in a loop because the bytecode runs in optimized C-level iteration.`,
  },

  // ==========================================
  // 3. INTERMEDIATE PYTHON
  // ==========================================
  'Lambda Functions': {
    title: 'Lambda Functions (Anonymous Callables)',
    summary: 'Small, single-expression anonymous functions created with the lambda keyword.',
    explanation: `Lambdas are typically used inline where a short callback function is expected.

\`\`\`python
# Syntax: lambda arg1, arg2: expression
add = lambda a, b: a + b
print(add(10, 5))  # 15

# Practical usage: Custom sorting keys
students = [
    {"name": "Alice", "score": 88},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 72}
]

# Sort by score descending
students_sorted = sorted(students, key=lambda s: s["score"], reverse=True)
print("Top student:", students_sorted[0]["name"])
\`\`\`

**Key Points:**
- Lambdas can contain only a single expression, not multi-line statements or variable assignments.`,
  },

  'Exception Handling': {
    title: 'Exception Handling (try / except / finally)',
    summary: 'Defensive programming mechanisms to catch and handle runtime errors gracefully.',
    explanation: `Robust Python code catches specific exceptions rather than letting unhandled crashes occur.

\`\`\`python
def safe_divide(numerator: float, denominator: float):
    try:
        result = numerator / denominator
    except ZeroDivisionError as e:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError as e:
        print("Error: Both arguments must be numeric.")
        return None
    else:
        # Executes only if NO exception occurred
        print(f"Success! Result: {result}")
        return result
    finally:
        # ALWAYS executes (e.g. for resource cleanup)
        print("Operation cleanup finished.")

safe_divide(10, 2)
safe_divide(10, 0)
\`\`\`

**Key Points:**
- Avoid bare \`except:\` clauses; always catch explicit exception types (\`ValueError\`, \`KeyError\`, etc.).`,
  },

  'File I/O': {
    title: 'File Input & Output Operations',
    summary: 'Reading, writing, and handling files safely using context managers.',
    explanation: `Always use the \`with\` statement when opening files to ensure file handles are automatically closed.

\`\`\`python
# Writing to a text file
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("Line 1: Python fundamentals\n")
    f.write("Line 2: Object-Oriented design\n")

# Reading line-by-line
with open("notes.txt", "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, 1):
        print(f"{line_num}: {line.strip()}")

# Working with JSON
import json
data = {"user": "Alex", "xp": 250}
with open("student.json", "w") as f:
    json.dump(data, f, indent=2)
\`\`\`

**Key Points:**
- The \`with\` statement guarantees file closure even if an exception is raised inside the block.`,
  },

  'Modules & Imports': {
    title: 'Modules, Packages & __name__',
    summary: 'Organizing code into reusable files and packages with clean import paths.',
    explanation: `Modules allow separating code into distinct files that can be imported across projects.

\`\`\`python
# Standard imports
import math
from datetime import datetime, timezone
from pathlib import Path

# Module entry point boilerplate
def main():
    now = datetime.now(timezone.utc)
    print(f"Executing at {now.isoformat()}")

if __name__ == "__main__":
    # Runs ONLY when the file is executed directly (not when imported)
    main()
\`\`\`

**Key Points:**
- The \`if __name__ == "__main__":\` guard prevents code from running automatically when imported by other modules.`,
  },

  'Closures': {
    title: 'Closures & Lexical Scoping',
    summary: 'Nested functions that retain access to variables from their enclosing scope even after that scope has finished execution.',
    explanation: `Closures allow bundling state with function behavior without using full classes.

\`\`\`python
def make_counter(start: int = 0):
    count = start

    def counter():
        nonlocal count
        count += 1
        return count

    return counter

# Creating independent closure instances
counter_a = make_counter(10)
counter_b = make_counter(100)

print(counter_a())  # 11
print(counter_a())  # 12
print(counter_b())  # 101 (independent state!)
\`\`\`

**Key Points:**
- Use the \`nonlocal\` keyword to modify variables defined in the enclosing function.`,
  },

  'Built-in Functions': {
    title: 'Python Core Built-in Functions',
    summary: 'Essential standard built-in utilities like zip, enumerate, map, filter, any, and all.',
    explanation: `Python includes powerful built-in utilities that eliminate the need for manual loops.

\`\`\`python
names = ["Alice", "Bob", "Charlie"]
scores = [95, 82, 88]

# 1. zip(): Combines multiple iterables in parallel
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# 2. any() and all(): Boolean checks across iterables
all_passing = all(s >= 70 for s in scores)  # True
has_honor = any(s >= 90 for s in scores)    # True

# 3. map() and filter()
evens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))  # [2, 4, 6]
\`\`\`

**Key Points:**
- \`zip()\` stops at the shortest iterable by default; use \`itertools.zip_longest()\` to pad with defaults.`,
  },

  'Functional Programming': {
    title: 'Functional Programming in Python',
    summary: 'Writing declarative, pure functions using itertools, functools, and immutable patterns.',
    explanation: `Python supports functional programming paradigms including pure functions and higher-order helpers.

\`\`\`python
from functools import reduce, partial

# 1. reduce: Combines elements cumulatively
numbers = [1, 2, 3, 4, 5]
product = reduce(lambda acc, x: acc * x, numbers)  # 120

# 2. partial: Pre-fills arguments of existing functions
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))    # 125
\`\`\`

**Key Points:**
- Pure functions avoid side effects (modifying external variables or mutable inputs in-place).`,
  },

  'Regular Expressions (Regex)': {
    title: 'Regular Expressions with the re Module',
    summary: 'Pattern matching, searching, and text replacement using regular expressions.',
    explanation: `The \`re\` module provides pattern-matching tools for text validation and extraction.

\`\`\`python
import re

text = "Contact support@pythonbuddy.edu or admin@tutor.org today!"

# Extract all email addresses
pattern = r"[\w\.-]+@[\w\.-]+\.\w+"
emails = re.findall(pattern, text)
print("Found emails:", emails)

# Validation with match/search
phone = "123-456-7890"
if re.match(r"^\d{3}-\d{3}-\d{4}$", phone):
    print("Valid phone format! ✅")

# Substitution
masked = re.sub(r"[\w\.-]+@", "***@", text)
print("Masked:", masked)
\`\`\`

**Key Points:**
- Always prefix regex patterns with \`r"..."\` (raw strings) to prevent Python from escaping backslashes.`,
  },

  // ==========================================
  // 4. OBJECT-ORIENTED PROGRAMMING (OOP)
  // ==========================================
  'OOP': {
    title: 'Object-Oriented Programming (OOP) Overview',
    summary: 'Four pillars of OOP in Python: Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    explanation: `OOP models programs as interacting objects containing both data (attributes) and behavior (methods).

\`\`\`python
class Student:
    # Class attribute shared by all instances
    school = "Python Academy"

    def __init__(self, name: str, xp: int = 0):
        # Instance attributes
        self.name = name
        self._xp = xp  # Protected attribute by convention

    def add_xp(self, amount: int):
        if amount > 0:
            self._xp += amount

    @property
    def level(self) -> str:
        return "Advanced" if self._xp >= 200 else "Beginner"

alex = Student("Alex", 150)
alex.add_xp(60)
print(f"{alex.name}: {alex.level} ({alex._xp} XP)")
\`\`\`

**Key Points:**
- Single underscore (\`_var\`) denotes protected convention; double underscore (\`__var\`) invokes name mangling.`,
  },

  'Classes & Objects': {
    title: 'Classes, Instances & Attribute Types',
    summary: 'Class blueprints, instance instantiation, constructors, and class vs instance attributes.',
    explanation: `A class defines the blueprint, while an object is a concrete instance allocated in memory.

\`\`\`python
class Course:
    total_enrollments = 0  # Class variable

    def __init__(self, title: str):
        self.title = title  # Instance variable
        Course.total_enrollments += 1

    @classmethod
    def get_total(cls):
        return f"Total courses created: {cls.total_enrollments}"

c1 = Course("Python Fundamentals")
c2 = Course("Advanced Metaprogramming")
print(Course.get_total())  # Total courses created: 2
\`\`\`

**Key Points:**
- Instance methods receive \`self\`; class methods receive \`cls\` (decorated with \`@classmethod\`).`,
  },

  'Inheritance & Polymorphism': {
    title: 'Inheritance, super() & Method Resolution Order',
    summary: 'Subclassing parent classes, calling super(), and polymorphic interface implementations.',
    explanation: `Inheritance allows child classes to reuse and override parent behavior.

\`\`\`python
class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        raise NotImplementedError("Subclasses must implement speak()")

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} says Woof! 🐶"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} says Meow! 🐱"

# Polymorphism in action:
animals = [Dog("Buddy"), Cat("Luna")]
for a in animals:
    print(a.speak())
\`\`\`

**Key Points:**
- Inspect class inheritance hierarchy using \`Class.mro()\` (Method Resolution Order).`,
  },

  'OOP / Dunder Methods': {
    title: 'Special / Dunder (Double Underscore) Methods',
    summary: 'Customizing object representation, operators, indexing, and sequence behavior with magic methods.',
    explanation: `Dunder methods let your custom objects integrate seamlessly with Python built-in syntax.

\`\`\`python
class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        """Formal representation for debugging."""
        return f"Vector({self.x}, {self.y})"

    def __str__(self) -> str:
        """User-friendly string representation."""
        return f"({self.x}, {self.y})"

    def __add__(self, other: "Vector") -> "Vector":
        """Overloads the + operator."""
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other: object) -> bool:
        """Overloads the == equality operator."""
        if not isinstance(other, Vector):
            return False
        return self.x == other.x and self.y == other.y

v1 = Vector(2, 4)
v2 = Vector(3, 1)
v3 = v1 + v2
print(v3)          # (5, 5)
print(repr(v3))    # Vector(5, 5)
\`\`\`

**Key Points:**
- Implement \`__len__\` and \`__getitem__\` to make objects act like sequences (\`len(obj)\`, \`obj[0]\`).`,
  },

  'OOP / Optimization': {
    title: 'OOP Optimization & __slots__',
    summary: 'Optimizing object memory footprint and attribute lookup speed using __slots__.',
    explanation: `By default, Python objects store instance attributes in a dynamic dictionary (\`__dict__\`). \`__slots__\` replaces this with a fixed-size array.

\`\`\`python
class OptimizedPoint:
    # Restricts attributes to x and y, bypassing __dict__ creation
    __slots__ = ("x", "y")

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

pt = OptimizedPoint(10.0, 20.0)
print(f"Point: ({pt.x}, {pt.y})")

# Attempting to assign new attributes raises AttributeError:
# pt.z = 30.0  # -> AttributeError: 'OptimizedPoint' object has no attribute 'z'
\`\`\`

**Key Points:**
- \`__slots__\` dramatically reduces memory consumption when creating millions of small instances.`,
  },

  // ==========================================
  // 5. ADVANCED PYTHON
  // ==========================================
  'Decorators': {
    title: 'Decorators & Higher-Order Functions',
    summary: 'Wrapping functions or classes to extend behavior dynamically without modifying source code.',
    explanation: `A decorator is a callable that accepts a function as input and returns an enhanced function.

\`\`\`python
import time
from functools import wraps

def timer_decorator(func):
    @wraps(func)  # Preserves original function name and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"⏱️ '{func.__name__}' took {elapsed:.5f}s to run")
        return result
    return wrapper

@timer_decorator
def calculate_heavy_sum(n: int) -> int:
    """Calculates sum of numbers up to n."""
    return sum(range(n))

print("Sum result:", calculate_heavy_sum(1_000_000))
\`\`\`

**Key Points:**
- Always use \`@wraps(func)\` from \`functools\` inside your decorator to retain the original metadata.`,
  },

  'Generators': {
    title: 'Generators & the yield Keyword',
    summary: 'Memory-efficient lazy iterators that produce values one at a time on demand.',
    explanation: `Unlike functions that return a complete list in memory, generators yield values lazily.

\`\`\`python
def fibonacci(limit: int):
    """Generates Fibonacci numbers up to limit without allocating memory for all values."""
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

# Using the generator in a loop
for num in fibonacci(50):
    print(num, end=" ")
print()

# Generator expression (analogous to list comprehension, but lazy)
squares_gen = (x ** 2 for x in range(1_000_000))
print("Next square:", next(squares_gen))  # 0
print("Next square:", next(squares_gen))  # 1
\`\`\`

**Key Points:**
- Generators maintain execution state between \`yield\` calls, saving massive amounts of memory on large datasets.`,
  },

  'Context Managers': {
    title: 'Context Managers & contextlib',
    summary: 'Managing resource setup and teardown using the with statement and __enter__ / __exit__.',
    explanation: `Context managers guarantee that resources (files, locks, DB connections) are cleaned up reliably.

\`\`\`python
# Approach 1: Class with __enter__ and __exit__
class TimerContext:
    def __enter__(self):
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.time() - self.start_time
        print(f"Block executed in {duration:.4f}s")
        return False  # Do not suppress exceptions

# Approach 2: contextlib.contextmanager generator
from contextlib import contextmanager

@contextmanager
def temporary_flag():
    print("Setup: Flag enabled")
    yield True
    print("Teardown: Flag disabled")

with temporary_flag() as flag:
    print(f"Inside block with flag = {flag}")
\`\`\`

**Key Points:**
- The \`__exit__\` method receives exception details if an error occurs inside the \`with\` block.`,
  },

  'Async / Await': {
    title: 'Asynchronous Programming with asyncio',
    summary: 'Concurrent non-blocking execution using coroutines, tasks, and the event loop.',
    explanation: `Async/await enables single-threaded cooperative multitasking, perfect for I/O-bound tasks.

\`\`\`python
import asyncio

async def fetch_user_data(user_id: int):
    print(f"Starting fetch for user {user_id}...")
    await asyncio.sleep(1)  # Simulates non-blocking network I/O
    print(f"Completed fetch for user {user_id}")
    return {"id": user_id, "name": f"Student_{user_id}"}

async def main():
    # Run multiple async operations concurrently
    results = await asyncio.gather(
        fetch_user_data(1),
        fetch_user_data(2),
        fetch_user_data(3)
    )
    print("All fetched results:", results)

# Run the event loop
# asyncio.run(main())
\`\`\`

**Key Points:**
- \`asyncio.gather()\` runs multiple coroutines concurrently.
- Never use blocking synchronous calls (like \`time.sleep\`) inside async functions; use \`asyncio.sleep\`.`,
  },

  'Concurrency': {
    title: 'Concurrency: Threads vs Multiprocessing',
    summary: 'Choosing between threading for I/O-bound work and multiprocessing for CPU-bound tasks.',
    explanation: `Python has a Global Interpreter Lock (GIL) that allows only one thread to execute Python bytecode at a time.

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# 1. ThreadPoolExecutor for I/O-bound tasks (Network, Disk)
def download_url(url: str):
    return f"Downloaded {url}"

with ThreadPoolExecutor(max_workers=3) as executor:
    urls = ["https://site-a.com", "https://site-b.com"]
    results = list(executor.map(download_url, urls))

# 2. ProcessPoolExecutor for CPU-bound tasks (Number crunching, Data Science)
def heavy_computation(n: int):
    return sum(i * i for i in range(n))

# with ProcessPoolExecutor() as executor:
#     results = list(executor.map(heavy_computation, [100000, 200000]))
\`\`\`

**Key Points:**
- **I/O-Bound**: Use \`threading\` or \`asyncio\` (releases GIL during socket/disk waits).
- **CPU-Bound**: Use \`multiprocessing\` to spawn separate Python processes across multiple CPU cores.`,
  },

  'Memory Management': {
    title: 'Memory Management & Garbage Collection',
    summary: 'Reference counting, cyclic garbage collection, and the gc module in CPython.',
    explanation: `CPython manages memory primarily through reference counting, complemented by a cyclic garbage collector.

\`\`\`python
import sys
import gc

a = [1, 2, 3]
print("Reference count:", sys.getrefcount(a))  # Note: getrefcount adds 1 temporary reference

b = a  # Ref count increments
del b  # Ref count decrements

# Cyclic reference detection
class Node:
    def __init__(self):
        self.neighbor = None

node1 = Node()
node2 = Node()
node1.neighbor = node2
node2.neighbor = node1  # Circular reference!

del node1, node2
# Cyclic collector automatically reclaims unreachable circular references
unreachable_count = gc.collect()
print(f"Reclaimed {unreachable_count} circular objects")
\`\`\`

**Key Points:**
- When an object's reference count drops to 0, its memory is deallocated immediately.
- The \`gc\` module runs periodically to clean up cyclic references that reference counting cannot resolve alone.`,
  },

  'Metaclasses': {
    title: 'Metaclasses: The Classes of Classes',
    summary: 'Deep dive into metaclasses, dynamic class construction, and intercepting class creation with type.',
    explanation: `In Python, classes are themselves objects! A metaclass is the "class of a class".
Just as an object is an instance of a class, a class is an instance of a metaclass. In Python, the default metaclass is \`type\`.

\`\`\`python
# 1. Classes are instances of 'type'
class Sample:
    pass

print(type(Sample))        # <class 'type'>
print(isinstance(Sample, type))  # True

# 2. Custom Metaclass that enforces uppercase attribute names
class UpperAttrMeta(type):
    def __new__(cls, name, bases, dct):
        # Intercept and uppercase non-dunder attribute names
        uppercase_attrs = {}
        for key, val in dct.items():
            if not key.startswith("__"):
                uppercase_attrs[key.upper()] = val
            else:
                uppercase_attrs[key] = val
        return super().__new__(cls, name, bases, uppercase_attrs)

# Applying the metaclass
class StudentModel(metaclass=UpperAttrMeta):
    title = "Python Learner"
    max_credits = 18

print(hasattr(StudentModel, "title"))        # False
print(hasattr(StudentModel, "TITLE"))        # True
print(StudentModel.TITLE)                    # "Python Learner"
print(StudentModel.MAX_CREDITS)              # 18
\`\`\`

**Key Points:**
- **Why use metaclasses?**
  - Framework architectures (e.g. Django ORM models, Pydantic validation, SQLAlchemy).
  - Enforcing coding standards, automatic method registration, or API serialization.
- **The Golden Rule**: *"If you don't know whether you need them, you don't."* (Tim Peters). For 99% of use cases, class decorators or \`__init_subclass__\` are simpler and preferred!`,
  },

  'Standard Library': {
    title: 'Python Standard Library Powerhouses',
    summary: 'Batteries included: collections, itertools, functools, pathlib, and math.',
    explanation: `Python comes with "batteries included". Leveraging standard library modules saves time and improves performance.

\`\`\`python
from collections import Counter, defaultdict
from itertools import chain, cycle
from pathlib import Path

# 1. Counter: Frequency counting
words = ["python", "code", "python", "tutor", "code", "python"]
counts = Counter(words)
print("Most common:", counts.most_common(1))  # [('python', 3)]

# 2. defaultdict: Eliminates KeyError on missing keys
grades = defaultdict(list)
grades["Alex"].append(95)
grades["Alex"].append(88)
print("Alex grades:", grades["Alex"])

# 3. pathlib: Modern object-oriented filesystem paths
config_path = Path.home() / "project" / "settings.json"
print("File suffix:", config_path.suffix)
\`\`\`

**Key Points:**
- Always check the standard library before installing external pip packages; Python has mature built-in tools for almost every task.`,
  },
};

/**
 * Helper to retrieve a formatted curriculum guide for any topic
 */
export function getTopicGuide(topicName, questionQuery = '') {
  if (!topicName) topicName = 'Variables';

  // Find exact or case-insensitive match
  const directMatch = TOPIC_KNOWLEDGE_BASE[topicName];
  if (directMatch) return directMatch;

  // Search case-insensitively
  const lowerTopic = topicName.toLowerCase();
  const lowerQuery = (questionQuery || '').toLowerCase();

  const foundKey = Object.keys(TOPIC_KNOWLEDGE_BASE).find((key) => {
    const k = key.toLowerCase();
    return lowerTopic.includes(k) || k.includes(lowerTopic) || lowerQuery.includes(k);
  });

  if (foundKey) {
    return TOPIC_KNOWLEDGE_BASE[foundKey];
  }

  // Fallback if topic is unknown
  return {
    title: `${topicName} Overview`,
    summary: `Foundational overview of ${topicName} in Python.`,
    explanation: `Here is a foundational review of **${topicName}** in Python:\n\n\`\`\`python\n# Practice ${topicName}\n# Explore interactive questions in the Quiz tab!\n\`\`\`\n\n- Visit the **Quiz** tab to practice questions on this topic and earn XP.`,
  };
}
