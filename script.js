//Required variables
var year = document.getElementById("year");
var make = document.getElementById("make");
var model = document.getElementById("model");
var mileage = document.getElementById("mileage");
const resultsContainer = document.getElementById('resultstable');
const clear = document.getElementById('clear');
const price = document.getElementById('price');
const submit = document.getElementById('submit');
const head = document.getElementById('heading');


//validating form on button press
function validate() {
    txt1 = year.value
    txt2 = make.value
    txt3 = model.value
    txt4 = mileage.value
    var text = /^[0-9]+$/;
    if (txt1 == '' || txt2 == '' || txt3 == '') {
        resultsContainer.innerHTML = "Please fill all the required fields";
        return;
    }
    else if ((txt1 != "") && (!text.test(txt1))) {
        resultsContainer.innerHTML = "Please Enter Numeric Values Only for year";
        return;
    }
    else if (txt1.length != 4) {
        resultsContainer.innerHTML = "Year is not proper. Please check";
        return;
    }
    else if ((txt4 != "") && (!text.test(txt4))) {
        resultsContainer.innerHTML = "Please Enter Numeric Values Only for mileage";
        return;
    }
    else {
        fetching();
    }
}


//Fetch the database if validation is successful
fetching = function () {
    resultsContainer.innerHTML = "Loading.."
    var p = 0;
    var count = 0;
    var a = 0;
    obj = {
        year: year.value,
        make: make.value,
        model: model.value,
        mileage: mileage.value
    }

    //clear entered values after clicking button
    year.value = '';
    make.value = '';
    model.value = '';
    mileage.value = '';

    fetch('/', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj)
    })
        .then(response => {
            return response.json()
        })
        .then((data) => {
            data = JSON.parse(data);
            resultsContainer.innerHTML = '';
            if (data.length > 0) {
                //head row
                var head = resultsContainer.createTHead();
                var row = head.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                cell1.innerHTML = "Year";
                cell2.innerHTML = "Make";
                cell3.innerHTML = "Model";
                cell4.innerHTML = "Mileage";
                cell5.innerHTML = "Price";
                //changing display of clear button from none to block
                clear.style.display = "block"
                data.forEach(car => {
                    //adding each row
                    const row = resultsContainer.insertRow(resultsContainer.rows.length);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    cell1.innerHTML = car.year
                    cell2.innerHTML = car.make
                    cell3.innerHTML = car.model
                    cell4.innerHTML = car.listing_mileage
                    cell5.innerHTML = car.listing_price
                    p += car.listing_price
                    count += 1
                    a = (p / count).toFixed(2)
                    price.innerHTML = `<p>The estimated value for your car is ${a} $</p>`
                    price.style.visibility = "visible"
                    //scrolling to price element
                    price.scrollIntoView({ behavior: "smooth" })
                })
            } else {
                price.innerHTML = ""
                clear.style.display = "none"
                const p = document.createElement('p');
                p.textContent = 'No results found.';
                resultsContainer.appendChild(p);
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

submit.addEventListener('click', (e) => {
    e.preventDefault();
    price.innerHTML = ""
    price.style.visibility = 'hidden'
    validate();
});

clear.addEventListener("click", (e) => {
    e.preventDefault();
    resultsContainer.innerHTML = ""
    price.innerHTML = ""
    price.style.visibility = 'hidden'
    clear.style.display = "none"
})