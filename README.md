# timetable-calculator

## ioBroker script

```javascript
// Initialize
var Text2, Empfaenger, Nachricht;

// Trigger
on({id: "telegram.0.communicate.request"/*Last received request*/, change: "any"}, async function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
// Load variables
	Text2 = getState("telegram.0.communicate.request").val;
	Empfaenger = Text2.slice(((1 + Text2.indexOf('[') + 1) - 1), (Text2.indexOf(']') + 1) - 1);
	Nachricht = Text2.slice(((1 + Text2.indexOf(']') + 1) - 1), Text2.length);
	
	// Check text conditions
//	Check for ...
	// Prüfen
	if (Nachricht == 'Übersicht') {
		// Nachricht senden
		sendTo('telegram.0', {
			text: 'Bitte wähle ein Button aus ' + Empfaenger,
			reply_markup: {
				keyboard: [
					['Name'],
					['Übersicht']
				],
				resize_keyboard: true,
				one_time_keyboard: true
			},
			user: Empfaenger
		});
    };
```

```javascript
if (/\(.+\)/.test(teacher)
```