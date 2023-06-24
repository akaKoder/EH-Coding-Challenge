# EH-Coding-Challenge
Amar K's solution to the EH Coding Challenge. 


**Intro**

The coding challenge asks for an application that produces an image on the user’s screen composed of precisely 32,768 unique colors, with each color appearing exactly once. The color components—red, green, and blue—are to be partitioned into 32 steps, creating a range of distinct colors with no repetitions or unused colors.

In my submission, I have included two solutions, one in Python and one in vanilla JS.

The JS solution has several added aesthetic advantages and sorting features, but if the assessment criteria was to be applied extremely pedantically, I figured it might be prudent to have an alternative solution that is guaranteed to satisfy even the most stringent of interpretations, hence the Python/CODETEST MODE button.

*What do I mean by “assessed pedantically”?*

The JavaScript version includes a couple of buttons that are overlaid on the color display, and their transparency can technically alter the perceived color of the blocks beneath them. This may lead to a pedantic interpretation that these colors aren't represented in their pure form on the screen, and thus the challenge's requirements are not being strictly met. The Python version, however, ensures that all colors are displayed without any overlay, thereby preserving the integrity of each color, especially so while in CODETEST MODE.

*Why did I not make use of the mentioned libraries/frameworks (React/MUI, Ionic, ImageMagick etc.) or other similar systems?*

My understanding of the coding challenge is that it was made to test algorithmic thinking and general programmatic solutions; while using certain third-party libraries, frameworks or systems could potentially simplify or expedite the task at hand, their introduction often brings with it added complexities, dependencies, and potential compatibility issues that outweigh their benefits in this context. This framework bloat would reasonably contradict the “Elegance in algorithms and data structures.” criteria, so I saw that part of the challenge’s text almost as a red-herring of sorts…

Similarly, if I was looking for the *easiest* possible solution, I could’ve just used ImageMagick's powerful command-line tools to generate an image with 32,768 unique colors and displayed it on the screen, or had one of the many generative natural language processing platforms generate a complete precomputed lookup table; this would vastly speed up execution time but I feel would likely be viewed as circumventing the spirit of the challenge.

The same applies in regards to Ionic and the like; it would be fairly straightforward to take the javascript and convert it into, for example, a desktop app through Eclipse, and similarly not too hard to make use of other aesthetically-oriented JS frameworks or GUI libraries if design was the top priority, since my programmatic solution can be taken and applied globally to any chosen GUI system (Material etc...).

I opted for a challenge submission that employs pure JavaScript and simple Python (with Tkinter for the GUI) to ensure that it remains accessible, understandable, and executable by a wide audience while still satisfying the task's core requirements.



**Code Overview/Breakdown**

*Python*;

- The script starts by creating a list of all possible RGB color values that are multiples of 8. This is done because RGB colors can have values ranging from 0 to 255. Dividing 256 by 8 yields 32 potential values for each of the Red, Green, and Blue channels. Thus, 32^3 equals 32,768 unique colors. The script then shuffles these colors to create randomness.
- A fullscreen Tkinter window is initiated, with the program calculating the dimensions of the rectangle to be drawn for each color based on the screen's resolution.
- The countdown label and canvas for the Tkinter window are set up, along with a background message on the canvas.
- Two functions to paint the screen with colors, draw\_all\_colours and draw\_colours, are defined. draw\_all\_colours displays all colors simultaneously, while draw\_colours gradually fills the screen, offering an animated color progression.
- The function code\_test allows toggling between the two color display modes. When code\_test\_mode is True, the screen is filled all at once, and the interface buttons disappear. When it's False, colors are displayed gradually, and the buttons reemerge.
- An alternative exit is provided by binding the quit\_app function to the Escape key.
- The 'Code Test' and 'Exit' buttons are set up and placed in the Tkinter window.
- The program concludes with the initiation of the main Tkinter event loop, which will keep running until the user chooses to exit.

*JavaScript:*

- The script begins by obtaining a reference to the HTML canvas and its context, setting its width and height to match the window's size.
- All 32,768 unique colors are generated similarly to the Python script, by iterating through possible RGB values in multiples of 8, and stored in an array.
- The drawColors function iteratively draws blocks of each color onto the canvas.
- The sortColors function allows the colors to be sorted based on different attributes (hue, saturation, or lightness). It re-renders the colors on the canvas upon every sort operation.
- Click events are assigned to sorting buttons in the HTML, triggering their respective sorts and redraws on the canvas.
- The rgbToHsl function is used to convert RGB colors to HSL (Hue, Saturation, Lightness) format for the sorting functions.
- The hilbert function is used to calculate the Hilbert curve positions of the colors, allowing for an additional method of sorting and displaying.
- The drawHilbert function uses the Hilbert curve positions calculated to draw the colors in an ordered manner on the canvas.
- A click event for the Hilbert sort button triggers the drawHilbert function, sorting the colors accordingly.
- The script also includes a fullscreen feature, which is triggered by a click event attached to a dedicated fullscreen button in the HTML.
- The program concludes by initially drawing the shuffled colors on the canvas, and further interactions can be made by the user.



**Sorting Option Explained**

The various sorting options are made in hopes of fulfill the “aesthetically pleasing (or at least interesting)” criteria;

“sortSaturation” is about the vibrancy of the colors, which means it makes colors more vivid or more muted, so the sort moves from saturated, vivid colors to more grayish or washed out colors. “sortLightness” arranges the colors from the most uplifting, light colors, to the deep, dark colors. This gives a nice gradient from white to black through the full range of colors.

“sortHue” arranges the colors according to their position in the color spectrum or the color wheel so it’s like sorting by their perceived "shade" from red to violet, while the sortRGB is pretty self-explanatory in that it takes the names values and alters them to achieve enough variance to meet the criteria.

Lightness, as defined in the HSL color model, is a measure of the relative luminance of a color, and is used as the sorting criterion when the sortLightness button is clicked.

Now, the Perceived Brightness one is an interesting one. Standard brightness is a simple average of the red, green, and blue color components. But perceived brightness?

That, as I’ve learned through the process of researching for this challenge, is a whole other thing.

It comes from the recognition that our eyes respond differently to different colors. For instance, we perceive green as brighter than red, which seems brighter than blue.

This realization has a significant role in the field of accessibility. By taking into account perceived brightness, we can create interfaces and designs that are not just visually pleasing, but also easier to read and navigate. It's important, especially for people with visual impairments or color blindness.

The formula used for calculating perceived brightness in this script, (r \* 299 + g \* 587 + b \* 114) / 1000, is derived from human vision science. The coefficients (299, 587, 114) represent the perceived intensity of red, green, and blue colors, respectively. Notice how green has a much larger coefficient? That's because our eyes are most sensitive to green light, less to red, and least to blue. The sum of these is then divided by 1000 to normalize the result. This formula, while not perfect, provides a closer match to human color perception than standard brightness.

As I've learned more about color manipulation and perception, I've come to appreciate these subtle, yet critical nuances of human perception and feel ready to create even more accessible and user-friendly designs.

[Here is the specific bit that I got the formula from; <https://www.w3.org/TR/AERT/#color-contrast>]



**Hilbert Curve**

The “sortHilbert” and the inverse can be applied to any of the choices; it organizes the colors based on their position along a Hilbert curve, which is a type of space-filling curve that visits every point in a square grid with a size of any power of 2 (which in this case, is 32768 (or 2^15)).

The function is recursive in nature, working on the principle of dividing the space into smaller quadrants and determining which quadrant the next point lies in.

In the context of this function:

- index is the distance along the Hilbert curve.
- n represents the order of the Hilbert curve. This is effectively the number of recursions the function will perform.
- dir is the direction of the curve, which gets inverted (dir ^ 1) with each level of recursion.
- shift is used for bitwise shifting operations that determine the quadrant for the next recursion.

Here's a breakdown of what the function is doing:

- If n equals 0, it means we've hit the base case of the recursion and return the point at (0, 0).
- half, quarter, and mask are computed for further calculations.
- rx and ry are determined based on the current index and shift. These binary values help decide the quadrant in which the next point lies.
- If dir is not equal to 0, it checks if rx and ry are the same, and if they are, it flips their values and then takes the XOR of ry and rx to update ry.
- The function then calls itself, passing n-1 and shift-2 to move to the next order of the curve and the appropriate shift, along with dir ^ 1 to flip the direction.
- The resulting x and y coordinates are calculated based on the updated ry and rx values.
