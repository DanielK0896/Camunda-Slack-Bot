# callbackId

## message

Elements are separated by "&%".

**Example:** message&%" + correlationKey + "&%setroom&%room

Elements:
1. identifier -> message or dialog#
2. correlationKey
3. name of the message to receive message
4. name of the variable 
   - information about user interactions such as pushedButtons or dialog text are stored inside this variable 
   - you can add more than one by separating them using ";" (e. g. for several dialog elements)




## dialog

Elements are separated by "&%".

**Example:** dialog&%0&%Veranstaltungsort$%Raum$%text$%z.B. EB222$%2$%15&%message&%" + correlationKey + "&%setroom&%room&%delete";

Elements:
1. identifier -> message or dialog
2. starts if: element = pushed button -> first option/button has the number 0, second option/button the number 1 and so on
3. dialog informations separated by "$%" (dialogVariablesSplit):
   - Headline in the dialog (title)
   - name of the dialog element (label) 
   - type of the dialog element (type) -> text, textarea or select
   - placeholder (placeholder)
   - minLength (minLength)
   - maxLength (maxLength)
   - optional (if type=select): options for a select menu (options) **OR**
   - optional (if type=select): data_source for a select menu (data_source)
4. new callback id part 1 (message!)
5. new callback id part 2 (message!)
6. new callback id part 3 (message!)
7. new callback id part 4 (message!)
8. optional "delete" -> message will be deleted after dialog submission

**Mind:** You can add more than one label, type, placeholder, minLength, maxLength, options/data_source by adding at the end of point 3.
(example: Veranstaltungsort$%Raum$%text$%z.B. EB222$%2$%15Veranstaltungsort$%Raum$%text$%z.B. EB222$%2$%15 -> two identical dialog elements)


Have a look at the API endpoint [/dialog/open](docs/dialogOpen.MD)!
