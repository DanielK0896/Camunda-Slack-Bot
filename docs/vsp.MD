# variable shortening principle

## textOptions

A number shows how often (in how many select_menus or overflow menus) the textOptions should be used.

- **11** -> in this case the textOptions are used 11 times; after every usage in a section the number is decreased by 1
         -> when the number reaches 0, the number and the textOptions are spliced (splice(0, 2))
- **-1** -> endless; textOptions are used for all following overflow or select_menus; not decreased

  1. The textOptions are separated by ";" (textOptionsInnerSplit)
  2. Number and textOptions are separated by "$$" (vspSplit)
  
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
  2.  Number and changes are separated by "$$" (vspSplit)
  
  **Example:**
  
  **5$$fields.1.text;fields.1.text;fields.1.text;New text 1;New text 2;New text 3**  -> changes are used 5 times 
  -> then no more changes; in every section fields.1.text changes to New text 1/2/3 depending on pushed Button (first/second/third)

## type

A number shows how often (in how many sections) the type should be used.

- **11** -> in this case the type is used 11 times; after every usage in a section the number is decreased by 1
         -> when the number reaches 0, the number and the type are spliced (splice(0, 2))
- **-1** -> endless; types are used for all following sections; not decreased

  1. Numbers and types are separated by "$$" (vspSplit)
  

  **Example:**
  
**1$$static_select$$1$$users_select** -> one static_select and one users_select

## confirm

A number shows how often (in how many sections) the confirmation t or f (true or false) should be used.

- **11** -> in this case the confirmation is used 11 times; after every usage in a section the number is decreased by 1
         -> when the number reaches 0, the number and the true/false are spliced (splice(0, 2))
- **-1** -> endless; confirmations are used for all following sections; not decreased

  1. Numbers and t/f (true/false) are separated by "$$" (vspSplit)
  

  **Example:**
  
**-1$$f** -> all buttons in all sections needn't be confirmed
