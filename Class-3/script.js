const heading = document.querySelector(".heading");
const button = document.querySelector("button");

button.addEventListener("click", () => {
  heading.style.color = "red";
  heading.innerHTML = "Tomato";
});
/*
Callback hell
    setTimeout(() => {
    console.log("1");
    setTimeout(() => {
        console.log("2");
        setTimeout(() => {
        console.log("3");
        }, 1000);
    }, 1000);
    }, 1000);


Callstack is a mechanism keeps track of every process
    let pro = new Promise((res,rej)=>{
        const quiz = "Winner"
        if(quiz==="Winner") {
            res()
        }
        else{
            rej()
        }
    })

    pro.then(()=>{
        console.log('Winner');
        
    }).catch(() => {
        console.log('Loser');
        
    })

Event loop is a constantly running process which checks the callstack is mt or not
If CallStack is empty (all the synchronous code is already executed) it will push one by one asynchronous function from callback queue to callstack 
*/

