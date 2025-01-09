const initializePageLoad = () => {
  const logOutBtn = document.getElementById("logout")

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
  }
}

const sendRequest = async (token) => {
  console.log("sending token", token)
  try {
    const response = await fetch("/api/private", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.log(`Error while trying to register: ${error.message}`)
  }
}

initializePageLoad()
