const token = localStorage.getItem("token")

document.getElementById("topicTitle").addEventListener("focus", function () {
  document.querySelector('label[for="topicTitle"]').classList.add("active")
})

document.addEventListener("DOMContentLoaded", () => {
  M.updateTextFields()
})

// Fetch Topics
const fetchTopics = async () => {
  const topicsDiv = document.getElementById("topics")

  try {
    const topicsData = await fetch("/api/topics")

    const topicsJson = await topicsData.json()

    topicsJson.forEach((topic) => {
      let newTopicDiv = document.createElement("div")
      newTopicDiv.className = "card z-depth-2 hoverable grey lighten-2"

      let newContentDiv = document.createElement("div")
      newContentDiv.className = "card-content"

      let newTitleSapn = document.createElement("span")
      newTitleSapn.appendChild(document.createTextNode(`${topic.title}`))
      newTitleSapn.className = "card-title"

      let newContentP = document.createElement("P")
      newContentP.appendChild(document.createTextNode(`${topic.content}`))

      let newUserNameP = document.createElement("P")
      newUserNameP.className = "grey-text text-darken-2"
      newUserNameP.appendChild(
        document.createTextNode(`${topic.username} - ${topic.createdAt}`)
      )

      let newButtontDiv = document.createElement("div")
      newButtontDiv.className = "card-action"

      let newDeleteBtn = document.createElement("button")
      newDeleteBtn.id = `${topic._id}`
      newDeleteBtn.className = "deleteTopic"
      newDeleteBtn.textContent = "Delete"

      newTopicDiv.appendChild(newContentDiv)
      newContentDiv.appendChild(newContentP)
      newContentDiv.appendChild(newUserNameP)

      newButtontDiv.appendChild(newDeleteBtn)
      newTopicDiv.appendChild(newButtontDiv)

      topicsDiv.appendChild(newTopicDiv)
    })
    const deleteTopicButtons = document.getElementsByClassName("deleteTopic")
    for (let i = 0; i < deleteTopicButtons.length; i++) {
      deleteTopicButtons[i].addEventListener("click", (event) => {
        deleteTopic(event.target.id)
      })
    }
  } catch (error) {
    console.log(`Error while trying to register: ${error.message}`)
  }
}

const initializePageLoad = () => {
  const topicForm = document.getElementById("topicForm")
  topicForm.style.display = "none"
  /*const logOutBtn = document.getElementById("logout")

  logOutBtn.addEventListener("click", function () {
    localStorage.removeItem("token")
    window.location.href = "/login.html"
  })

  const token = localStorage.getItem("token")
  console.log("token", token)
  if (!token) {
    window.location.href = "/login.html"
  } else {
    sendRequest(token)
  }*/
  if (token) {
    topicForm.style.display = "block"
  }

  document.getElementById("topicForm").addEventListener("submit", (event) => {
    console.log("first")
    fetchData(event)
  })

  document.getElementById("loginForm").addEventListener("submit", (event) => {
    fetchDataLogin(event)
  })

  fetchTopics()
}

const fetchData = async (event) => {
  event.preventDefault()
  let token = localStorage.getItem("token")

  const formData = {
    title: event.target.topicTitle.value,
    content: event.target.topicText.value,
  }

  try {
    const response = await fetch("/api/topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
    if (!response.ok) {
      document.getElementById("error").innerText =
        "Error when trying to register. Please try again."
    } else {
      //window.location.href = "/login.html"
    }
  } catch (error) {
    console.log(`Error while trying to register: ${error.message}`)
  }
}

const deleteTopic = async (id) => {
  let token = localStorage.getItem("token")
  try {
    const response = await fetch("/api/topic/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const resData = await response.json()

    alert(resData.message)
  } catch (error) {
    console.log(`Error while trying to register: ${error.message}`)
  }
}

initializePageLoad()

const initializeLogin = () => {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    fetchDataLogin(event)
  })
}

document.getElementById("register").addEventListener("click", () => {
  window.location.href = "/register.html"
})

const fetchDataLogin = async (event) => {
  console.log("buttonClicked")
  event.preventDefault()

  const formData = {
    email: event.target.email.value,
    password: event.target.password.value,
  }

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    if (!response.ok) {
      document.getElementById("error").innerText =
        "Error when trying to login. Please try again."
    } else {
      const data = await response.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
        topicForm.style.display = "block"
      }
    }
  } catch (error) {
    console.log(`Error while trying to register: ${error.message}`)
  }
}
