
const addACardBtns = document.getElementsByClassName('add-card-container');
const cardTitleContainers = document.getElementsByClassName('card-title-container');
const addTitleBtns = document.getElementsByClassName('add-card-btn');
const cardTitles = document.getElementsByClassName('card-title');
const cancelBtn = document.getElementsByClassName('cancel-btn');
const cardContainers = document.getElementsByClassName('card-container');
const taskContainers = document.getElementsByClassName('assignment')
const taskPanelBackground = document.getElementsByClassName('task-panel-background')[0]
const taskPanel = document.getElementsByClassName('task-panel')[0]
const taskPanelcancelBtn = document.getElementsByClassName('task-panel-cancel-btn')[0]
const taskPanelTitle = document.getElementsByClassName('task-panel-title')[0]
const taskPanelDescription = document.getElementsByClassName('task-panel-description')[0]
const taskPanelSaveBtn = document.getElementsByClassName('task-panel-save-btn')[0]

/* Store the unique tokens */
const tokenList = new Set(); /* DB Related */
/* Stote the task Details */
const taskObjList = [] /* DB Related */
/* Type of Tasks */
const taskTypes = ['todo','doing','done']

/* current task id */
let currTaskId; 

/* Generate the token with size sz */
function generateToken(sz){
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for(let i = 0; i < sz; i++){
        token += str.charAt(Math.random()*(str.length - 1));
    }
    return token;
}

/* Generate the unique token with size sz */
function generateUniqueToken(sz){
    let token = generateToken(sz);
    while(tokenList.has(token)){
        token = generateToken(sz);
    }
    return token;
}

/* Create the task object */
function createTaskObj(token,title,type){
    return {
        'token': token,
        'title': title,
        'taskType': taskTypes[type],
        'description': ''
    }
}

/* Changing the task type */
function changeTaskType(token,type){ /* DB Related */
    for(let i=0;i<taskObjList.length;i++){
        if(taskObjList[i]['token'] === token){
            taskObjList[i]['taskType'] = taskTypes[type];
        }
    }
}

/* Create card with the title */
function createCard(title,type){

    let token = generateUniqueToken(10); /* DB Related */
    tokenList.add(token)


    let taskObj = createTaskObj(token,title,type); /* DB Related */
    taskObjList.push(taskObj)

    let cardDetails = document.createElement('div');
    cardDetails.className = 'card-details';
    cardDetails.draggable = 'true';
    cardDetails.id = `${token}`;

    let card = 
    `
    <p class="task-name">${title}</p>
    <span class="material-symbols-outlined">
        edit
    </span>
    `

    cardDetails.innerHTML = card;

    return cardDetails;
}

/* Dragable for the tasks */
function dragableForTask(taskEle){
    taskEle.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('token',taskEle.id)
    })
}

/* Get Title By using Id */
function getTitleById(token){
    for(let i = 0; i < taskObjList.length; i++){
        if(taskObjList[i]['token']===token){
            return taskObjList[i]['title'];
        }
    }
}

/* Get Descrpition By using Id */
function getDescrpitionById(token){
    for(let i = 0; i < taskObjList.length; i++){
        if(taskObjList[i]['token']===token){
            return taskObjList[i]['description'];
        }
    }
}

/* Update Title By using Id */
function updateTitleById(token,title){
    for(let i = 0; i < taskObjList.length; i++){
        if(taskObjList[i]['token'] == token){
            taskObjList[i]['title'] = title;
            break;
        }
    }
}

/* Update Description By using Id */
function updateDescriptionById(token,description){
    for(let i = 0; i < taskObjList.length; i++){
        if(taskObjList[i]['token'] == token){
            taskObjList[i]['description'] = description;
            break;
        }
    }
}


/* Card Click Event */
function onCardClickEvent(taskEle){
    taskEle.addEventListener('click', (event) => {
        taskPanelBackground.style.display = 'flex';
        currTaskId = taskEle.id;
        let title = getTitleById(currTaskId);
        let description = getDescrpitionById(currTaskId);
        taskPanelTitle.value = title;
        taskPanelDescription.value = description;
    })
}

/* Event listeners for the todo, doing and done */
for(let i = 0; i < 3; i++){
    /* Hide the Add a Card btn and show the textarea */
    addACardBtns[i].addEventListener('click',(event) => {
        cardTitleContainers[i].style.display = 'block';
        addACardBtns[i].style.display = 'none';
    })
    /* Add the task to the type of work */
    addTitleBtns[i].addEventListener('click',(event) => {
        const title = cardTitles[i].value.trim();
        if(title!=='' && title!=undefined){
            taskEle = createCard(title,i);
            dragableForTask(taskEle)
            onCardClickEvent(taskEle)
            cardContainers[i].appendChild(taskEle);
        }
        cardTitles[i].value = '';
    })
    /* On Clicking the cancel btn */
    cancelBtn[i].addEventListener('click', (event) => {
        cardTitleContainers[i].style.display = 'none';
        addACardBtns[i].style.display = 'block';
    })
    /* Task Container dragover */
    taskContainers[i].addEventListener('dragover', (event) => {
        event.preventDefault();
    })
    /* Task Container droping task */
    taskContainers[i].addEventListener('drop', () => {
        const token = event.dataTransfer.getData('token')
        const taskEle = document.getElementById(token)
        cardContainers[i].appendChild(taskEle)

        /* Change the task type */
        changeTaskType(token,i) /* DB Related */
    })
}

/* Task panel Background click Event */
taskPanelBackground.addEventListener('click',(event) => {
    taskPanelBackground.style.display = 'none';
})

/* Task panel cancel btn click Event */
taskPanelcancelBtn.addEventListener('click',(event) => {
    taskPanelBackground.style.display = 'none';
})

/* Task panel click Event */
taskPanel.addEventListener('click',(event) => {
    event.stopPropagation();
})

/* Task panel save Btn */
taskPanelSaveBtn.addEventListener('click',(event) => {
    let title = taskPanelTitle.value;
    let description = taskPanelDescription.value;
    const currEle = document.querySelector(`#${currTaskId} > p`);
    currEle.innerHTML = title;
    updateTitleById(currTaskId,title);
    updateDescriptionById(currTaskId,description);
    currTaskId = undefined;
    taskPanelBackground.style.display = 'none';
})