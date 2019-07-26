const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname));


app.get('/', (req, res) => res.send('<br><div id="log"></div><canvas id="c" width="200" height="200" ></canvas><div id="crafting"></div><script  src="https://code.jquery.com/jquery-3.4.1.min.js"  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="  crossorigin="anonymous"></script><script src="bundle.js"></script>'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

