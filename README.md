# Javascript BotDetector
An easy way to check if users visiting your websites are bots or not. 

If you are selling products online or you just want to check if your visitors are real persons, you can act many strategies to do that.
User-Agent can be used most of time to detect bot engine but what you can do to detect real users interacting with your pages?

This project aims to be a tool that can help you doing that checking many scenarios actually allowed over internet:
- scroll and mouse movement (for desktop)
- gesture and device sensors recognizement (for mobile)

## How to
Download and put `bot-detector.js` into your project js folder.
After you have to include it in your page:
```html
<script src="js/bot-detector.js"></script>
````


Now you can instantiate new `BotDetector` class and wait for the result event. 
```javascript
<script type="text/javascript" language="javascript">
	var callback = function(result) {
		if (result.isBot) {
			alert("You are a fucking bot!");
		}
		else {
			alert("Welcome user!");
		}
	};
	var botDetector = new BotDetector({
		timeout: 1000,
		callback: callback
	});
</script>
```
Your `callback` method will be called when detection process is completed and will returns a property, `isBot` containing response
to your question: is, my visitor, a bot?
