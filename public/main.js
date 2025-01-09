const submitButton = document.getElementById("submit-button")
const getUsersButton = document.getElementById("getUsers")

// Add user
submitButton.addEventListener("click", async function() {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value

    const userFormData = {
        name: name,
        email: email
    };

    const userData = await fetch("http://localhost:3000/users", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userFormData)
    })
    const userDataJson = await userData.json()
    console.log(userDataJson)
})

const userList = document.getElementById("userList")

// Get users
getUsersButton.addEventListener("click", async function() {
   
    const userData = await fetch("http://localhost:3000/users")
    const usersJson = await userData.json()

    
    console.log(usersJson.users[0].name)
    usersJson.users.forEach(user => {
       
        let newListItem = document.createElement("li")
        newListItem.appendChild(document.createTextNode(`${user.name} - ${user.email}`))
        userList.appendChild(newListItem)
    });
    
})


