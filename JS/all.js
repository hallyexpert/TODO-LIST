// loginPage btn
const loginPage = document.querySelector("#loginPage")
const sendLoginBtn = document.querySelector(".sendLoginBtn")
const signinBtnChange = document.querySelector(".signinBtnChange")
const loginEmail = document.querySelector(".loginEmail")
const loginPwd = document.querySelector(".loginPwd")

// signinPage btn
const siginPage = document.querySelector("#siginPage")
const sendInfoBtn = document.querySelector(".sendInfoBtn")
const loginBtnChange = document.querySelector(".loginBtnChange")

const signinEmail = document.querySelector(".signinEmail")
const signinPassword = document.querySelector(".signinPassword")
const signinPasswordAgain = document.querySelector(".signinPasswordAgain")
const nickname = document.querySelector(".nickname")

// todoPage
const todoPage = document.querySelector("#todoPage")
const showName = document.querySelector(".showName")
const signOut = document.querySelector(".signOut")

const list = document.querySelector(".list")
const save = document.querySelector(".btn_add")
const txt = document.querySelector(".txt")
const check = document.querySelector(".check")
const list_num = document.querySelector(".list_footer span")
const clean = document.querySelector(".clean")
const tab = document.querySelector(".tab")

// 切換頁面
function changePage(status) {
  if (status === signinBtnChange) {
    loginPage.classList.toggle("none")
    siginPage.classList.remove("none")
  } else if (status === loginBtnChange) {
    siginPage.classList.toggle("none")
    loginPage.classList.remove("none")
  } else if (status === sendLoginBtn) {
    loginPage.classList.toggle("none")
    todoPage.classList.remove("none")
  } else if (status === signOut) {
    todoPage.classList.toggle("none")
    loginPage.classList.remove("none")
  }
}
signinBtnChange.addEventListener("click", () => changePage(signinBtnChange))
loginBtnChange.addEventListener("click", () => changePage(loginBtnChange))


const apiUrl = 'https://todoo.5xcamp.us'

// 註冊的涵式
sendInfoBtn.addEventListener("click", () => callSignin())
function callSignin() {
  if (signinEmail.value === "" || signinPassword.value === "" || nickname.value === "") {
    Swal.fire("帳號、密碼或暱稱不得為空!");
    return
  } else if (signinPassword.value !== signinPasswordAgain.value) {
    Swal.fire("兩次密碼不相同!");
    return
  } else if (signinPassword.value.trim().length < 6) {
    Swal.fire("密碼需多於 6 個字元 !");
    return
  }
  email = signinEmail.value
  short = nickname.value
  pwd = signinPassword.value

  axios.post(`${apiUrl}/users`, {
    "user": {
      "email": email,
      "nickname": short,
      "password": pwd
    }
  })
    .then(res => {
      let timerInterval;
      Swal.fire({
        title: `${res.data.message}!`,
        html: "將在 <b></b> 秒後自動跳轉",
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          changePage(loginBtnChange)
        }
      });

    })
    .catch(err => {
      Swal.fire({
        title: err.response.data.message,
        text: err.response.data.error,
        icon: "error"
      });
    })
  signinEmail.value = ""
  nickname.value = ""
  signinPassword.value = ""
  signinPasswordAgain.value = ""
}


// 登入
sendLoginBtn.addEventListener("click", () => logIn())
function logIn() {
  if (loginEmail.value === "" || loginPwd.value === "") {
    Swal.fire("帳號或密碼不得為空!");
    return
  }
  email = loginEmail.value
  password = loginPwd.value


  axios.post(`${apiUrl}/users/sign_in`, {
    "user": {
      "email": email,
      "password": password
    }
  })
    .then(res => {
      axios.defaults.headers.common['Authorization'] = res.headers.authorization
      showName.textContent = res.data.nickname
      getTodo()
      changePage(sendLoginBtn)
    })
    .catch(err => {
      console.log(err.response)
      Swal.fire({
        title: "錯誤!",
        text: err.response.data.message,
        icon: "error"
      });
    })


  callAll()
  loginEmail.value = ""
  loginPwd.value = ""
}

// 登出
signOut.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "確定要登出嗎?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes"
  })
  .then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${apiUrl}/users/sign_out`)
    .then(() => {
      Swal.fire({
        title: "登出成功!",
        icon: "success"
      })
      changePage(signOut)
    })
    .catch(err => console.log(err.response))
    }
  });


})


// 取得
let todoData = []
function getTodo() {
  axios.get(`${apiUrl}/todos`)
    .then(res => {
      todoData = res.data.todos
      render(todoData)
    })
    .catch(err => console.log(err.response))

}

function render(arr) {
  let strdone = ""
  let strwork = ""
  arr.forEach((item) => {
    if (item.completed_at !== null) {
      strdone += `<li data-id=${item.id}><label class="checkbox" >
        <input type="checkbox" class="check"  ${item.completed_at} checked><span>${item.content}</span>
        </label>
        <a href="#" class="edit"></a>
        <a href="#" class="delete"></a></li>`
    } else {
      strwork += `<li data-id=${item.id}><label class="checkbox" >
        <input type="checkbox" class="check"  ${item.completed_at}><span>${item.content}</span>
        </label>
        <a href="#" class="edit"></a>
        <a href="#" class="delete"></a></li>`
    }
  });
  list_num.textContent = todoData.filter(item => item.completed_at === null).length
  list.innerHTML = strwork + strdone;
}

// 新增
txt.addEventListener("keydown", e => {
  if (e.keyCode === 13) {
    save.click();
  }
})
save.addEventListener("click", () => {
  if (txt.value === "") {
    Swal.fire("請輸入內容!!!")
    return
  }
  content = txt.value
  addTodo(content)
  txt.value = ""
})
function addTodo(todo) {
  axios.post(`${apiUrl}/todos`, {
    "todo": {
      "content": todo
    }
  })
    .then(() => {
      getTodo()
      callAll()
    })
    .catch(err => console.log(err.response))
}



// 更新
function updateTodo(todo, todoId) {
  axios.put(`${apiUrl}/todos/${todoId}`, {
    "todo": {
      "content": todo
    }
  })
    .then(res => { getTodo() })
    .catch(err => console.log(err.response))
}

// 刪除
function deleteTodo(todoId) {
  axios.delete(`${apiUrl}/todos/${todoId}`)
    .then(() => {
      getTodo()

    })
    .catch(err => {
      message = err.response.data.message
      console.log(err.response)
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: message,
        showConfirmButton: false,
        timer: 1000
      });
    })
}
// 刪除全部
clean.addEventListener("click", () => { deleteAll() })
function deleteAll() {
  let deleteData = []
  todoData.filter((item) => {
    if (item.completed_at !== null) {
      deleteData.push(item.id)
    }
  })
  Promise.all(deleteData.map(deleteTodo))
    .then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "成功刪除",
        showConfirmButton: false,
        timer: 1000
      });
    })
    .catch(err => console.log(err))
}
// 狀態更新
function toggleTodo(todoId) {
  axios.patch(`${apiUrl}/todos/${todoId}/toggle`, {})
    .then(() => {
      getTodo()
    })
    .catch(err => console.log(err.response))
}

list.addEventListener("click", (e) => {
  let target = e.target
  const todoId = target.closest('li').dataset.id
  if (target.getAttribute("class") === "check") {
    toggleTodo(todoId)
    return
  } else if (target.getAttribute("class") === "delete") {
    deleteTodo(todoId)
    return
  } else if (target.getAttribute("class") === "edit") {
    changecontent(todoId)
  }
})

async function changecontent(todoId) {
  console.log(todoId)
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputLabel: "Message",
    inputPlaceholder: "Type your message here...",
    inputAttributes: {
      "aria-label": "Type your message here"
    },
    showCancelButton: true
  });
  if (text) {
    Swal.fire({
      title: "更改為",
      text: text,
    })
    updateTodo(text, todoId)
  }

}



tab.addEventListener("click", (e) => {
  changetab(e)
  let newData = []
  if (e.target.getAttribute("class") === "all active") {
    newData = todoData
  } else if (e.target.getAttribute("class") === "doing active") {
    newData = todoData.filter(item => item.completed_at === null)
  } else if (e.target.getAttribute("class") === "done active") {
    newData = todoData.filter(item => item.completed_at !== null)
  }
  render(newData)
})

// 切換標籤、回到全部標籤
function changetab(e) {
  let tabs = document.querySelectorAll(".tab li")
  tabs.forEach(item => {
    item.classList.remove("active")
  })
  e.target.classList.add("active")
}

function callAll() {
  let tabs = document.querySelectorAll(".tab li")
  tabs.forEach(item => {
    item.classList.remove("active")
  })
  tabs[0].classList.add("active")

}

