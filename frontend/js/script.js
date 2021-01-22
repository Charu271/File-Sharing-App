const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector(".inputFile");
const browse = document.querySelector(".browse");
const progressContainer = document.querySelector(".progress-container");
const backgroundProgress = document.querySelector(".background-progress");
const percent = document.querySelector(".percent");
const progressBar = document.querySelector(".progress-bar");
const copyIcon = document.querySelector(".copy-icon");
const fileShare = document.querySelector(".shareFile");
const linkContainer = document.querySelector(".link-container");
const emailForm = document.querySelector(".email-form");
const toast = document.querySelector(".toasts");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged"))
    dropZone.classList.add("dragged");
});
dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  console.log(e);
  const files = e.dataTransfer.files;
  console.log(files.length);
  if (files.length) {
    fileInput.files = files;
    console.log(fileInput.files);
    uploadFile();
  }
});

browse.addEventListener("click", (e) => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

const uploadFile = async () => {
  if (fileInput.files.length > 1) {
    fileInput.value = "";
    showToast("More than one file can't be uploaded");
    return;
  }
  if (fileInput.files[0].size > 1000 * 1024 * 1024) {
    fileInput.value = "";
    showToast("Maximum upload size : 100MB");
    return;
  }
  fileShare.style.display = "none";
  progressContainer.style.display = "block";
  backgroundProgress.style.borderRadius = "10px 0px 0px 10px";
  backgroundProgress.style.width = "0%";
  percent.innerHTML = `0 %`;
  progressBar.style.transform = `scaleX(0)`;
  let formData = new FormData();
  const file = fileInput.files[0];
  formData.append("myfile", file);
  console.log(formData);
  const response = await axios.post(
    "https://share-circle.herokuapp.com/api/files",
    formData,
    {
      onUploadProgress: (e) => {
        //console.log(e);

        var percentage = Math.round((e.loaded / e.total) * 100);
        if (percentage === 100) {
          fileInput.value = "";
          backgroundProgress.style.borderRadius = "10px";
        }
        backgroundProgress.style.width = `${percentage}%`;
        percent.innerHTML = `${percentage} %`;
        progressBar.style.transform = `scaleX(${percentage / 100})`;
        console.log(percentage);
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.data.file) {
    linkContainer.value = response.data.file;
    showFile();
  } else {
    showToast("Something went wrong");
  }
  console.log(response);
};
function showFile() {
  progressContainer.style.display = "none";

  fileShare.style.display = "block";
}
copyIcon.addEventListener("click", () => {
  linkContainer.select();
  document.execCommand("copy");
  showToast("Link copied to clipboard");
});
let toasttimer;
function showToast(msg) {
  //clearTimeout(toasttimer);
  toast.innerHTML = msg;
  toast.style.display = "block";
  toasttimer = setTimeout(() => {
    toast.style.display = "none";
  }, 5000);
}
// emailForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//   // if (
//   //   regex.test(emailForm.elements[0].value) &&
//   //   regex.test(emailForm.elements[1].value)
//   // ) {
//   //   alert("Email fields are not valid");
//   // } else {
//   // const data = JSON.stringify();
//   // console.log(data);
//   // console.log(linkContainer.value.split("/").splice(-1, 1)[0].toString());
//   // console.log(emailForm.elements["to-email"].value);
//   // console.log(emailForm.elements["from-email"].value);
//   const res = await axios.post(
//     "https://share-circle.herokuapp.com/api/files/send",
//     {
//       uuid: "09ed5318-d74b-43dd-bbc8-7c800ea6946d",
//       emailTo: "charu0012.cse19@chitkara.edu.in",
//       emailFrom: "hiteshsachdeva343@gmail.com",
//     }
//   );
//   console.log(res);
//   console.log("entered");
//   // fetch("https://share-circle.herokuapp.com/api/files/send", {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   },
//   //   body: JSON.stringify(data),
//   // }).then((res) => console.log(res.json()));
//   // .then((data) => console.log(data));
// });
