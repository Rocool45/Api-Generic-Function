const cl= console.log;

const postContainer = document.getElementById("postContainer")
const submitpost= document.getElementById("submitpost")
const updatepot =document.getElementById("updatepot")
const postForm= document.getElementById("postForm")
const titlecontrol = document.getElementById("title")
const bodycontrol = document.getElementById("body")
const useridcontrol = document.getElementById("userid")

const snkbar= (masg,icon)=>{
    swal.fire({
        title:masg,
        icon:icon,
        timer:3000
    })
}
const Base_url ="https://jsonplaceholder.typicode.com"
const Post_url = `${Base_url}/posts`;

const MakeApiCall=(methodName,apiUrl,masgbody)=>{
    let xhr= new XMLHttpRequest()
    xhr.open(methodName,apiUrl)

    xhr.onload =function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response)
        if(methodName === "GET" && Array.isArray(data)){
            templating(data)
             snkbar("Post Fatched Successfuly","success")
        }else if(methodName === "GET"){
            PatchData(data)
        }else if(methodName === "POST"){
            createcard({...masgbody,id:data.id})
            postForm.reset()
          snkbar("Post Added Successfuly",'success')
        }
        else if(methodName === "PATCH"){

            let card =document.getElementById(masgbody.id)
           let h2 = card.querySelector("h2")
           let p = card.querySelector("p")
           h2.innerHTML= masgbody.title
           p.innerHTML= masgbody.body

           postForm.reset()

           submitpost.classList.remove("d-none")
           updatepot.classList.add("d-none")
           snkbar("Post is Updated","success")
        }else if(methodName === "DELETE"){
           let R_id = localStorage.getItem("Remove_id")
           let card = document.getElementById(R_id).parentElement
           card.remove()
            snkbar("Your Post is Removed!!!","success")
             postForm.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
        }else(err=>{
            snkbar("Network Issue","error")
        })
    }
}

  let msg = masgbody ? JSON.stringify(masgbody) : null
    xhr.send(msg)
}

MakeApiCall("GET",Post_url,null)

const createcard=(masgbody)=>{
    let col = document.createElement("div")
            col.classList ="col-md-4 mb-5"
            col.innerHTML =`
              <div class="card h-100" id="${masgbody.id}">
                    <div class="card-header">
                        <h2>${masgbody.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${masgbody.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onclick="onEdit(this)"  class="btn btn-success">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
                    </div>
                </div>
            `
            postContainer.prepend(col)
}
const PatchData=(res)=>{
     titlecontrol.value = res.title;
             bodycontrol.value = res.body;
              useridcontrol.value = res.userId;

              submitpost.classList.add("d-none")
              updatepot.classList.remove("d-none")
}

const templating =(d)=>{
    let result ="";

    d.forEach(post => {
        result +=` <div class="col-md-4 mb-5">
                <div class="card h-100" id="${post.id}">
                    <div class="card-header">
                        <h2>${post.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onclick="onEdit(this)"  class="btn btn-success">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
                    </div>
                </div>
            </div>`
    });
    postContainer.innerHTML= result;

}
const onAddPost=(eve)=>{
    eve.preventDefault();

    let Post_obj={
        title:titlecontrol.value,
        body:bodycontrol.value,
        userId:useridcontrol.value
    }
    MakeApiCall("POST",Post_url,Post_obj)
}

const onEdit =(ele)=>{
    let Edit_id = ele.closest(".card").id;
    let Edit_Url = `${Base_url}/posts/${Edit_id}`;
    localStorage.setItem("Edit_id",Edit_id)

postForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    MakeApiCall("GET",Edit_Url,null)
}

const onUpdate =(ele)=>{
    let Update_id = localStorage.getItem("Edit_id")
    cl(Update_id)
    let Update_url = `${Base_url}/posts/${Update_id}`
    
    let Update_obj={
        title:titlecontrol.value,
        body:bodycontrol.value,
        userId:useridcontrol.value,
         id:Update_id
    }
    MakeApiCall("PATCH",Update_url,Update_obj)

    // document.getElementById(Update_id).scrollIntoView({
    //     behavior: "smooth",
    //     block: "center"
    // });

     let updatedCard = document.getElementById(Update_id);
    if(updatedCard){
        updatedCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    
}}

const onRemove=(ele)=>{

    Swal.fire({
  title: "Are you sure?",
  text: "You won't Remove this Post!!!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
   let Remove_id = ele.closest(".card").id
    let Remove_url = `${Base_url}/posts/${Remove_id}`
        localStorage.setItem("Remove_id",Remove_id)
        
    MakeApiCall("DELETE",Remove_url,null)
      
  }
});

}

postForm.addEventListener("submit",onAddPost)
updatepot.addEventListener("click",onUpdate)