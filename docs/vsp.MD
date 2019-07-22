# variable shortening principle

## textOptions

A number shows how often (in how many select_menus or overflow menus) the textOptions should be used.

- **11** -> in this case the textOptions are used 11 times; after every usage in a section the number is decreased by 1
         -> when the number reaches 0, the number and the textOptions are spliced (splice(0, 2))
- **-1** -> endless; textOptions are used for all following overflow or select_menus; not decreased

  1. The textOptions are separated by ";" (textOptionsInnerSplit)
  2. Number and textOptions are separated by "$$" (textOptionsOuterSplit)
  
  **Example:**
  
  **5$$Option1;Option2;Option3$$-1$$Option4;Option5** -> Options 1,2 and 3 are used 5 times 
  -> then both elements are spliced -> **-1$$Option4;Option5** -> options 4,5 are used in all following overflow or select_menus

## changes

A number shows how often (in how many sections) the changes should be used.

- **11** -> in this case the changes are used 11 times; after every usage in a section the number is decreased by 1
         -> when the number reaches 0, the number and the changes are spliced (splice(0, 2))
- **-1** -> endless; changes are used for all following sections; not decreased

  1. The changes are separated by ";" (changesInnerSplit)
     - First elements -> properties where the changes should be used
     - Last elements -> changes
     - e. g. fields.1.text;fields.1.text;New text 1;New text 2
       - When first option is choosen -> fields.1.text = New text 1
       - When second option is choosen -> fields.1.text = New text 2
  2.  Number and changes are separated by "$$" (changesOuterSplit)
  
  **Example:**
  
  **5$$fields.1.text;fields.1.text;fields.1.text;New text 1;New text 2;New text 3**  -> changes are used 5 times 
  -> then no more changes; in every section fields.1.text changes to New text 1/2/3 depending on pushed Button (first/second/third)
