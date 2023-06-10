import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from "cors"
import nodemailer from 'nodemailer'
const app = express()
mongoose.connect("mongodb://localhost:27017/bbc",{useNewUrlParser:true,useUnifiedTopology:true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once('open', function () {
  console.log('Mongoose connected to MongoDB!');
});

const imageObjSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:false
  },
  image:{
    type:String,
    required:false
  },
  inDb:{
    type:Boolean,
    required:false
  },
  imageId:{
    type:String,
    required:false
  }
})

const locationDetailsSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  fullAddress: {
    type: String,
    required: false,
  },
  lat: {
    type: Number,
    required: false,
  },
  lng: {
    type: Number,
    required: false,
  },
});




const userSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  userName:{
    type:String,
    required:false
  },
  gender:{
    type:String,
    required:false
  },
  userLastName:{
    type:String,
    required:false
  },
  date:{
    type:String,
    required:false
  },
  online:{
    type:Boolean,
    required:true
  },
  userDescription:{
    type:String,
    required:false
  },
  firebaseImage:{
    type:String,
    required:false
  },
  userImage:{
    type:String,
    required:false
  },
  locationInformations:{
    details:{
      type:locationDetailsSchema,
      required:false
    }
  },
  userImages:[
    {
      image:{
        type:imageObjSchema,
        required:false
      }
    }
  ]
})

const User = mongoose.model("User",userSchema)
module.exports = User


//event group message notify

const notifyMessageSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:false
  },
  date:{
    type:Date,
    default:Date.now
  },
  message:{
    type:String,
    required:false
  },
  detail:{
    type:userSchema,
    required:false
  }
})



//friendList

const friendSchema = new mongoose.Schema({
  selectedUserId:{
    type:String,
    required:true
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required:false
  },
  detail:{
    type:userSchema,
    required:false
  }
});

const friendListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  friends: [friendSchema]
});

const FriendList = mongoose.model('FriendList', friendListSchema);
module.exports = FriendList

const blockedListSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  blockeds:[friendSchema]
})

const BlockedList = mongoose.model('BlockedList',blockedListSchema)
module.exports = BlockedList



//eventGroupSchema

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  detail:{
    type:userSchema,
    required:false
  }
});

const currentEventSchema = new mongoose.Schema({
  eventStartDate: {
    type: String,
    required: false
  },
  eventEndDate: {
    type: String,
    required: false
  },
  lat:{
    type:String,
    required:false
  },
  lng:{
    type:String,
    required:false,
  },
  date:{
    type:Date,
    default:Date.now
  },
  userId:{
    type:String,
    required:false
  }
})

const currentEventPositionSchema = new mongoose.Schema({
  lat:{
    type:String,
    required:false
  },
  lng:{
    type:String,
    required:false,
  },
  date:{
    type:Date,
    default:Date.now
  },
  userId:{
    type:String,
    required:false
  }
})


const eventGroupSchema = new mongoose.Schema({
  eventPosition:{
    type:currentEventPositionSchema,
    required:false
  },
  currentEvent:{
    type:currentEventSchema,
    required:false
  },
  image:{
    type:String,
    required:false
  },
  name:{
    type:String,
    required:true
  },
  icon:{
    type:String,
    required:false
  },
  color:{
    type:String,
    required:false
  },
  eventType:{
    type:String,
    required:false
  },
  maxMember:{
    type:Number,
    required:false
  },
  description:{
    type:String,
    required:false
  },
  createrName:{
    type:String,
    required:false
  },
  createrEmail:{
    type:String,
    required:true
  },
  createrId:{
    type:String,
    required:true
  },
  fullDate:{
    type:String,
    required:false
  },
  date:{
    type:Date,
    default:Date.now()
  },
  eventStep:{
    type:Number,
    required:false,
    default:0
  },
  oldMemberList:[memberSchema],
  memberList:[memberSchema],
  requestList:[memberSchema],
  blockedList:[memberSchema],
  locationList:[locationDetailsSchema],
  confirmEventList:[memberSchema],
  adviceList:[memberSchema],
  images:[imageObjSchema],
  sharerId:{
    type:String,
    required:false
  },
  eventId:{
    type:String,
    required:false
  },
  eventNotifyMessage:[notifyMessageSchema]
})

const EventList = mongoose.model('EventList',eventGroupSchema)
module.exports = EventList

//saved Events

const savedEventListSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  savedEvents:[eventGroupSchema]
})

const SavedEventList = mongoose.model('SavedEventList',savedEventListSchema)
module.exports = SavedEventList

const oldEventListSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  oldEventList:[eventGroupSchema]
})

const OldEventList = mongoose.model('OldEventList',oldEventListSchema)
module.exports = OldEventList


const notifyListSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  sharedEvents:[eventGroupSchema],
  sharedUsers:[memberSchema],
  newAddedUsers:[memberSchema],
  requestGroupEvents:[eventGroupSchema]
})

const NotifyList = mongoose.model('NotifyList',notifyListSchema)
module.exports = NotifyList


app.use(cors({
  origin:'http://localhost:9000'
}))
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json()) 
/* 
app.use(cors({
  origin:'newapp-eb613.firebaseapp.com'
}))
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json()) */


//event advice list crud operations

app.delete('/bbc/eventlists/:currentEventId/:currentUserId/:selectedUserId/removeFromAdviceList',async (req,res)=>{
    const {currentEventId,currentUserId,selectedUserId} = req.params
  try{
    const currentevent = await EventList.findById(currentEventId)
    currentevent.adviceList = currentevent.adviceList.filter(object => String(object.userId) !== String(selectedUserId))
    await currentevent.save()
    res.status(200).json(currentevent)
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})

app.get('/bbc/eventlists/:currentEventId/getAdviceList',async (req,res)=>{
  const {currentEventId} = req.params
  try{
    let users = await User.find()
    const currentevent = await EventList.findById(currentEventId)
    if(currentevent.adviceList && users.length > 0){
      currentevent.adviceList.forEach(element=>{
        const result = users.find(object => String(object._id) === String(element.userId))
        if(result){
          element.detail = result
        }
      })
      res.status(200).json({adviceList:currentevent.adviceList})
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})

app.post('/bbc/eventlists/:currentEventId/:currentUserId/postAdviceList',async (req,res)=>{
  const {currentEventId,currentUserId} = req.params
  try{
    let currentevent = await EventList.findById(currentEventId)
    const result = currentevent.adviceList.some(object => String(object.userId) === String(req.body._id))
    if(result === true){
      res.status(200).json({message:`${req.body.userName ?? req.body.email}, ${req.body.userName && req.body.userLastName ? req.body.userLastName : ''} Adlı Kullanıcı Zaten Listede.`})
    }else{
      const userData = {
        userId:req.body._id,
      }
      currentevent.adviceList.push(userData)
      await currentevent.save()
      res.status(200).json(currentevent)
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})



//event blocked users


app.get('/bbc/eventlists/:currentEventId/blockedList',async (req,res)=>{
  const {currentEventId} = req.params
  try{
    let users = await User.find()
    if(users.length > 0 ){
      const currentevent = await EventList.findById(currentEventId)
      currentevent.blockedList.forEach(element =>{
        const result = users.find(object => String(object._id) === String(element.userId))
        if(result){
          element.detail = result
        }
      })
      res.status(200).json(currentevent)
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})



//group notifies


app.delete('/bbc/eventlists/:currentEventId/:currentUserId/:selectedNotifyMessageId/removeEventNotifyMessage',async (req,res)=>{
  const {currentEventId,currentUserId,selectedNotifyMessageId} = req.params
  try{
    const currentevent = await EventList.findById(currentEventId)
    currentevent.eventNotifyMessage = currentevent.eventNotifyMessage.filter(object => String(object._id) !== String(selectedNotifyMessageId))
    await currentevent.save()
    res.status(200).json(currentevent)
  }catch(error){
    console.log(error)
  }
})


app.post('/bbc/eventlists/:selectedEventId/:currentUserId/sendGroupMessage',async (req,res)=>{
  const {selectedEventId,currentUserId} = req.params
  try{
    let currentuser = await User.findById(currentUserId)
    const messageData = req.body
    messageData.detail = currentuser
    const currentevent = await EventList.findById(selectedEventId)
    currentevent.eventNotifyMessage.push(messageData)
    await currentevent.save()
    res.status(200).json(currentevent)
  }catch(error){
    console.log(error)
  }
})



//get ortak frıends



app.get('/bbc/friendList/:selectedUserId/:currentUserId/commonFriends',async (req,res)=>{
  const {selectedUserId,currentUserId} = req.params
  try{
    let users = await User.find()
    let myFriends = await FriendList.findOne({userId : currentUserId})
    let selectedUserFriends = await FriendList.findOne({userId : selectedUserId})
    if(users.length > 0){
      myFriends.friends.forEach(element =>{
        const result = users.find(object => String(object._id) === String(element.selectedUserId))
        if(result){
          element.detail = result
        }
      })
      let commonFriends = []
      selectedUserFriends.friends.forEach(element => {
        const result = myFriends.friends.find(object => String(object.selectedUserId) === String(element.selectedUserId))
        if(result){
          commonFriends.push(result)
        }
      });
      res.status(200).json(commonFriends)
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})



//from notify to alleventpage check event there is or not





app.get('/bbc/eventlists/:currentEventId/findInNotifies',async (req,res)=>{
  const {currentEventId} = req.params
  try{
    let eventlist = await EventList.find()
    if(eventlist.length > 0 ){
      const result = eventlist.find(object => String(object._id) === String(currentEventId))
      if(result){
        res.status(200).json({findedEvent:result,inDb:true})
      }else{
        res.status(200).json({findedEvent:{}})
      }
    }
  }catch(error){
    res.status(200).json({message:'Internal Server Error'})
  }
})

// post group request to user

//clear all Notifies
app.delete('/bbc/notifylists/:currentUserId/removeAllNotifies',async (req,res)=>{
  const {currentUserId} = req.params
  try{
    const notifylist = await NotifyList.findOne({userId : currentUserId})
    notifylist.newAddedUsers = []
    notifylist.requestGroupEvents = []
    notifylist.sharedEvents = []
    notifylist.sharedUsers = []
    await notifylist.save()
    res.status(200).json(notifylist)
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})





//requestGroupEvents


app.delete('/bbc/notifylists/:currentUserId/:currentEventId/removeRequestEvent',async(req,res)=>{
  const {currentUserId, currentEventId,indexNumber} = req.params
  try{
    const notifylist = await NotifyList.findOne({userId : currentUserId})
    notifylist.requestGroupEvents = notifylist.requestGroupEvents.filter(object => String(object._id) !== String(currentEventId))
    await notifylist.save()
    res.status(200).json(notifylist)
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})


app.post('/bbc/notifylists/:currentUserId/:selectedUserId/:currentEventId/sendRequest',async(req,res)=>{
  const {currentUserId,selectedUserId, currentEventId} = req.params
  try{
    const selectedUserBlockedList = await BlockedList.findOne({userId : selectedUserId})
    if(selectedUserBlockedList && selectedUserBlockedList.blockeds){
      const result = selectedUserBlockedList.blockeds.find(object => String(object.selectedUserId) === String(currentUserId))
      if(!result){
        const eventData = req.body
        delete eventData._id
        eventData.eventId = currentEventId
        const notifylist = await NotifyList.findOneAndUpdate(
          {userId : selectedUserId},
          {$push : {requestGroupEvents : eventData}},
          {new:true,upsert:true}
        )
        res.status(200).json(notifylist)
      }
    }else{
      const eventData = req.body
      delete eventData._id
      eventData.eventId = currentEventId
      const notifylist = await NotifyList.findOneAndUpdate(
        {userId : selectedUserId},
        {$push : {requestGroupEvents : eventData}},
        {new:true,upsert:true}
      )
      res.status(200).json(notifylist)
    }
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})


// added uesr infos to notifys

app.delete('/bbc/notifylists/:currentUserId/:selectedUserId/newAddedUsers',async (req,res)=>{
  const {currentUserId,selectedUserId} = req.params
  try{
    const notifylist = await NotifyList.findOne({userId:currentUserId})
    notifylist.newAddedUsers = notifylist.newAddedUsers.filter(object => String(object.userId) !== String(selectedUserId))
    await notifylist.save()
    res.status(200).json({notifylist:notifylist,deletedUserId:selectedUserId})
  }catch{
    res.status(500).json({message:'internal server error'})
  }
})

app.post("/bbc/notifylists/:currentUserId/:selectedUserId/sendInfosToSelectedUser",async (req,res)=>{
  const {currentUserId,selectedUserId} = req.params
  try{
    const notifylist = await NotifyList.findOneAndUpdate(
      {userId:selectedUserId},
      {$push:{newAddedUsers:req.body}},
      {new:true,upsert:true}
    )
    res.status(200).json(notifylist)
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})
//shareEvent CRUD operations

app.delete('/bbc/notifylists/:currentUserId/:currentEventId/removeSelectedSharedNotify/:sharerId',async (req,res)=>{
  const {currentUserId,currentEventId,sharerId} = req.params
  try{
    let mynotifylist = await NotifyList.findOne({userId : currentUserId})
    /* mynotifylist.sharedEvents = mynotifylist.sharedEvents.filter(object => String(object._id) !== String(currentEventId)) */
    const result = mynotifylist.sharedEvents.find(object => String(object.sharerId) === String(sharerId) && String(object._id) === String(currentEventId))
    if(result){
      /* mynotifylist.sharedEvents = mynotifylist.sharedEvents.filter(object => String(object._id) !== String(result._id)) */
      let indexToRemove = -1
      mynotifylist.sharedEvents.forEach((element,index) => {
        if(element.sharerId === result.sharerId && element._id === result._id){
          indexToRemove = index
        }
      });
      if(indexToRemove !== -1){
        mynotifylist.sharedEvents.splice(indexToRemove,1)
      }
    }
    await mynotifylist.save()
    res.status(200).json(mynotifylist)
  }catch(error){
    res.status(500).json({message:'Internal Server error'})
  }
})


app.get('/bbc/notifylists/:currentUserId/getSharedEvents',async (req,res) =>{
  const {currentEventId,currentUserId} = req.params
  try{
    let users = await User.find()
    let mynotifylist = await NotifyList.findOne({userId : currentUserId})
    if(mynotifylist.newAddedUsers){
      mynotifylist.newAddedUsers.forEach(element => {
        const result = users.find(object => String(object._id) === String(element.userId))
        if(result){
          element.detail = result
        }
      });
    }
    res.status(200).json({myNotifyList:mynotifylist})
  }catch(error){
    res.status(500).json({message:'Internal  Server Error'})
  }
})

app.post('/bbc/notifylists/:currentEventId/:currentUserId/shareEvent',async (req,res)=>{
  const {currentEventId,currentUserId} = req.params
  try{
    const sharedData = req.body
    const mynotifylist = await NotifyList.findOneAndUpdate(
      {userId : currentUserId},
      {$push : {sharedEvents : sharedData}},
      {new:true,upsert:true}
    )
    res.status(200).json(mynotifylist)
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})

/* 
    selectedEvent.selectedEventId = currentEventId
    delete selectedEvent._id */
/*     
    const myNotifies = await NotifyList.findOne({userId : currentUserId})
    const selectedEvent = req.body
    delete selectedEvent._id 
    myNotifies.sharedEvents.push(selectedEvent)
    await myNotifies.save()
    res.status(200).json(myNotifies) 
    */


//get old Members


app.get('/bbc/eventlists/:currentEventId/oldmemberslist/:currentUserId',async (req,res)=>{
  const {currentEventId, currentUserId} = req.params
  try{
    const currentevent = await EventList.findById(currentEventId)
    let users = await User.find()
    if(users.length > 0 && currentevent){
      if(currentevent.oldMemberList.length > 0){
        let newoldmemberlist = []
        currentevent.oldMemberList.forEach(element => {
          const result = users.find(object => String(object._id) === String(element.userId))
          if(result){
            newoldmemberlist.push(result)
          }
        });
        res.status(200).json({oldMemberList:newoldmemberlist,currentevent:currentevent})
      }else{
        res.status(200).json({oldMemberList:[],currentevent:currentevent})
      }
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})

//remove from currentevent

app.delete('/bbc/eventlists/:currentEventId/leaveFromEvent/:currentUserId',async (req,res) =>{
  const {currentEventId,currentUserId} = req.params
  try{
    const currentevent = await EventList.findById(currentEventId)
    if(currentevent){
      const result = currentevent.locationList.some(object => String(object.userId) === String(currentUserId))
      if(result){
        currentevent.locationList = currentevent.locationList.filter(object => String(object.userId) !== String(currentUserId))
      }
      currentevent.memberList= currentevent.memberList.filter(object => String(object.userId) !== String(currentUserId))
      const secondResult = currentevent.oldMemberList.some(object => String(object.userId) === String(currentUserId))
      if(!secondResult){
        currentevent.oldMemberList.push({userId:currentUserId})
      }
      await currentevent.save()
      res.status(200).json({currentevent:currentevent})
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})

//delete old event


app.delete('/bbc/oldeventlists/:currentEventId/removeEvent/:currentUserId',async (req,res)=>{
  const {currentEventId,currentUserId} = req.params
  try{
    const oldEventList = await OldEventList.findOne({userId : currentUserId})
    if(oldEventList){
      oldEventList.oldEventList = oldEventList.oldEventList.filter(object => String(object._id) !== String(currentEventId))
      await oldEventList.save()
      res.status(200).json(oldEventList)
    }
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})




//detail of selectedEvent from myeventpage


app.get('/bbc/oldEventDetail/:currentEventId/eventDetail/:currentUserId',async (req,res)=>{
  const {currentEventId,currentUserId} = req.params
  try{
    let users = await User.find()
    const myoldevents = await OldEventList.findOne({userId : currentUserId})
    if(myoldevents){
      const result = myoldevents.oldEventList.find(object => String(object._id) === String(currentEventId))
      if(result){

        //memberlist = users
        let newMemberList = []

        const createrAcc = users.find(object => String(object._id) === String(result.createrId))
        if(createrAcc){
          newMemberList.push(createrAcc)
        }
        result.memberList.forEach(element => {
          const checkUser = users.find(object => String(object._id) === String(element.userId))
          if(checkUser&&checkUser._id !== result.createrId){
            newMemberList.push(checkUser)
          }
        });
        const findMe = newMemberList.find(object => String(object._id) === String(currentUserId))
        if(findMe){
          findMe.userName = 'Siz'
        }
        res.status(200).json({findedEvent:result,memberList:newMemberList})
      }
    }else{
      res.status(200).json({})
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//myOldEVents

app.get('/bbc/eventlists/:currentUserId/oldEvents',async (req,res) =>{
  const {currentUserId} = req.params
  try{
    const oldevent = await OldEventList.findOne({userId : currentUserId})
    let uniqueCategoryList = []
    oldevent.oldEventList.forEach(element => {
      const result = uniqueCategoryList.some(object => object === element.eventType)
      if(!result){
        uniqueCategoryList.push(element.eventType)
      }
    });
    res.status(200).json({oldEvent:oldevent,uniqueCategoryList:uniqueCategoryList})
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})



//common event groups



app.get('/bbc/eventlists/:selectedUserId/commonEventGroups/:currentUserId',async (req,res) =>{
  const {selectedUserId,currentUserId} = req.params
  try{
    const selectedUserOldEvent = await OldEventList.findOne({userId : selectedUserId})
    if(selectedUserOldEvent){
      selectedUserOldEvent.oldEventList.forEach(element => {
        const result =  element.memberList.some(object=> object.userId === currentUserId)
        if(!result){
          selectedUserOldEvent.oldEventList = selectedUserOldEvent.oldEventList.filter(object => object._id !== element._id)
        }
      });
      res.status(200).json(selectedUserOldEvent)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})





/* 

    const user = { selectedUserId, name, email };
    const blockedList = await BlockedList.findOneAndUpdate(
      { userId },
      { $push: { blockeds: user } },
      { new: true, upsert: true }
    );
    res.status(200).json(blockedList);
*/


//oldEVentList
//first end step

app.put('/bbc/oldeventlists/:currentEventId/removeImage/:currentUserId',async (req,res) =>{
  const {currentUserId,currentEventId} = req.params
  try{
    const currentEvent = await EventList.findById(currentEventId)
    if(currentEvent){
      currentEvent.images = currentEvent.images.filter(object => String(object._id) !== String(req.body._id))
      await currentEvent.save()
      res.status(200).json(currentEvent)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/bbc/oldeventlists/:currentEventId/getImages/:currentUserId',async (req,res) =>{
  const {currentUserId,currentEventId} = req.params
  try{
    const currentEvent = await EventList.findById(currentEventId)
    if(currentEvent){
      if(currentEvent.images){
        const myImages = currentEvent.images.filter(object => String(object.userId) === String(currentUserId))
        const allImages = currentEvent.images
        res.status(200).json({myImages:myImages.length > 0 ? myImages : [],allImages:allImages.length > 0 ? allImages :[]})
      }
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.put('/bbc/oldeventlists/updateEventStep/:currentUserId/:currentEventId',async (req,res)=>{
  const {currentUserId,currentEventId} = req.params
  try{
    const currentevent = await EventList.findById(currentEventId)
    if(currentevent){
      currentevent.eventStep = Number(req.body.number)
      await currentevent.save()
      res.status(200).json(currentevent)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/bbc/oldeventlists/postImagesToEvent/:currentUserId/:currentEventId',async (req,res) =>{
  const {currentUserId,currentEventId} = req.params
  const imageList = req.body
  try{
    const currentEvent = await EventList.findById(currentEventId)
    if(currentEvent){
      imageList.forEach(element =>{
        currentEvent.images.push(element)
      })
      await currentEvent.save()
      res.status(200).json(currentEvent)
    }else{
      res.status(404).json({message:'not found'})
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//last step
app.put('/bbc/oldeventlists/updateevent/:currentUserId/:currentEventId',async (req,res) =>{
  const {currentUserId,currentEventId} = req.params
  try{  
    const currentevent = await EventList.findById(currentEventId)
    if(currentevent){
      currentevent.currentEvent = {}
      currentevent.confirmEventList = []
      currentevent.images = []
      currentevent.eventStep = 0
      await currentevent.save()
      res.status(200).json(currentevent)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/bbc/oldeventlists/:currentUserId/:currentEventId',async (req,res) =>{
  const {currentUserId,currentEventId} = req.params
  try{
/*     const user = await OldEventList.findOneAndUpdate(
      {userId : currentUserId},
      {$push : {oldEventList : req.body}},
      {new:true,upsert:true}
    ) */
    const user = await OldEventList.findOne({userId : currentUserId})
    const newData = req.body
    delete newData._id
    user.oldEventList.push(newData)
    await user.save()
    res.status(200).json(user)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//loop in eventcomppanel for request members

app.get('/bbc/eventlists/:currentEventId/eventMembers/:currentUserId',async (req,res) =>{
  const {currentEventId,currentUserId} = req.params
  try{
    const users = await User.find()
    const eventList = await EventList.findById(currentEventId)
    if(eventList && users){
      const newList = []

      const myAcc = eventList.memberList.some(object => String(object.userId) === String(eventList.createrId))
      if(!myAcc){
        eventList.memberList.push({userId:eventList.createrId})
      }
      users.forEach(element => {
        const result = eventList.memberList.find((object) => String(object.userId) === String(element._id))
        if(result){
          newList.push(element)
        }
      });
      const secondResult = newList.find(object => String(object._id) === String(currentUserId))
      if(secondResult){
        secondResult.userName = 'Siz'
      } 
      res.status(200).json(newList)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/bbc/eventlists/:currentEventId/currentEvent/:currentUserId',async (req,res) =>{
  const {currentEventId,currentUserId} = req.params
  try{
    const eventList = await EventList.findById(currentEventId)
    if(eventList){
      const result = eventList.confirmEventList.find(object => object.userId === currentUserId)
      if(result){
        eventList.confirmEventList = eventList.confirmEventList.filter(object => object.userId !== currentUserId)
        await eventList.save()
        res.status(200).json(eventList)
      }else{
        eventList.confirmEventList.push(req.body)
        await eventList.save()
        res.status(200).json(eventList)
      }
    }else if(!eventList) throw new Error('no event')
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.post('/bbc/eventlists/:currentEventId/currentEvent',async (req,res) =>{
  const {currentEventId} = req.params
  try{
    const eventList = await EventList.findById(currentEventId)
    if(eventList){
      eventList.currentEvent = req.body
      await eventList.save()
      res.status(200).json(eventList)
    }else{
      res.status(404).json({message:'Error'})
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


/* 
      if(eventList.eventPosition){
        eventList.eventPosition.lat = req.body.lat
        eventList.eventPosition.lng = req.body.lng
        eventList.eventPosition.userId = req.body.userId

        await eventList.save()
        res.status(200).json(eventList)
      }else{
        eventList.eventPosition = req.body
        await eventList.save()
        res.status(200).json(eventList)
      }

*/

app.post('/bbc/eventlists/:currentEventId/eventPosition',async (req,res) =>{
  const {currentEventId} = req.params
  try{
    const eventList = await EventList.findById(currentEventId)
    if(eventList){
      eventList.eventPosition = req.body
      await eventList.save()
      res.status(200).json(eventList)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
//

app.post('/bbc/savedeventlists/:currentUserId/savedEvents', async (req,res) =>{
  const {currentUserId} = req.params
  try{
    const savedEventList = await SavedEventList.findOneAndUpdate(
      {userId : currentUserId},
      {$push : {savedEvents : req.body}},
      {new:true,upsert:true}
    )
    if(!savedEventList) throw new Error('Not found')
    res.status(200).json(savedEventList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

 app.delete('/bbc/savedeventlists/:currentUserId/savedEvents/:selectedEventId',async (req,res) =>{
  const {currentUserId,selectedEventId} = req.params
  try{
    const savedEventList = await SavedEventList.findOneAndUpdate(
      {userId : currentUserId},
      {$pull : {savedEvents : { _id : selectedEventId }}},
      {new:true}
    )
    res.status(200).json(savedEventList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/bbc/savedeventlists/:currentUserId',async (req,res) =>{
  const {currentUserId} = req.params
  try{
    const savedEventList = await SavedEventList.findOne({userId : currentUserId})
    if(!savedEventList){
      res.status(200).json([])
    }else{
      res.status(200).json(savedEventList)
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
//
app.get('/bbc/users/getUserForLoop/:userId',async (req,res) =>{
  const {userId} = req.params
  try{
    const userList = await User.findOne({_id : userId })
    if(!userList) throw new Error('user not founded')
    res.status(200).json(userList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//eventListRequests
/* 

    const memberedList = []
    eventList.forEach(element => {
      const result = element.memberList.some(object => object.userId === myId)
      if(result){
        memberedList.push(element)
      }
    });
    res.status(200).json(memberedList)
*/

app.get('/bbc/eventlists/onlyMembered/:myId',async (req,res)=>{
  const {myId} = req.params
  try{
    let eventList = await EventList.find()
    if(!eventList) throw new Error('no event')
    eventList.forEach(element => {
      const result = element.memberList.find(object => object.userId === myId)
      if(!result && element.createrId !== myId){
        eventList = eventList.filter(object => object._id !== element._id)
      }
    });
    res.status(200).json(eventList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.delete('/bbc/eventlists/:selectedEventId/blockedList/:selectedUserId',async (req,res) =>{
  const {selectedEventId, selectedUserId} = req.params
  try{
    const eventList = await EventList.findByIdAndUpdate(
      {_id:selectedEventId},
      {$pull:{blockedList: {userId : selectedUserId}}},
      {new:true}
    )
    if(!eventList) throw new Error('not found')
    res.status(200).json(eventList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/bbc/eventlists/:selectedEventId/blockedList', async (req,res) =>{
  const {selectedEventId} = req.params
  try{
    const eventList = await EventList.findOneAndUpdate(
      {_id:selectedEventId},
      {$push:{blockedList:req.body}},
      {new:true,upsert:true}
    )
    if(!eventList) throw new Error('No eevent')
    res.status(200).json(eventList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

//myEventRequest

app.delete('/bbc/eventlists/:selectedEventId/memberList/:selectedUserId',async (req,res) =>{
  const {selectedEventId,selectedUserId} = req.params 
  try{
    const eventList = await EventList.findOneAndUpdate(
      {_id:selectedEventId},
      {$pull: {memberList : {userId : selectedUserId}}},
      {new:true}
    )
    if (!eventList) throw new Error('No event found');
    res.status(200).json(eventList);
  }catch(error){
    console.error(error)
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.post('/bbc/eventlists/:selectedEventId/memberList',async (req,res) =>{
  const {selectedEventId} = req.params
  try{
/*     const eventList = await EventList.findOneAndUpdate(
      {_id : selectedEventId},
      {$push : {memberList : req.body}},
      {new:true, upsert:true}
    ) */
    const eventList = await EventList.findById(selectedEventId)
    if(!eventList) throw new Error('no event')

    eventList.memberList.push({userId:req.body.userId})
    const result = eventList.oldMemberList.some(object => String(object.userId) === String(req.body.userId))
    if(result){
      eventList.oldMemberList = eventList.oldMemberList.filter(object => String(object.userId) !== String(req.body.userId))
    }
    await eventList.save()
    res.status(200).json(eventList)
  }catch(error){
    console.error(error)
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.delete('/bbc/eventlists/:selectedEventId/requestList/:myId', async (req, res) => {
  const { selectedEventId, myId } = req.params;
  try {
    const eventList = await EventList.findOneAndUpdate(
      { _id: selectedEventId },
      { $pull: { requestList: { userId: myId } } },
      { new: true }
    );
    if (!eventList) throw new Error('No event found');
    res.status(200).json(eventList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/bbc/eventlists/:selectedEventId/requestList/:myId',async (req,res) =>{
  const {selectedEventId,myId} = req.params
  try{
    const eventList = await EventList.findOneAndUpdate(
      {_id : selectedEventId},
      {$push : {requestList : req.body}},
      {new: true, upsert:true}
    )
    if(!eventList) throw new Error('no event')
    res.status(200).json(eventList)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.delete('/bbc/eventlists/:selectedEventId/locationList/:myId',async (req,res) =>{
  const {selectedEventId,myId} = req.params
  try{
    const eventList = await EventList.findOneAndUpdate(
      {_id:selectedEventId},
      {$pull : {locationList: {userId : myId}}},
      {new:true}
    )
    res.status(200).json(eventList)
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/bbc/eventlists/:selectedEventId/locationList/:myId',async (req,res) =>{
  const {selectedEventId,myId} = req.params
  try{
    const eventList = await EventList.findById(selectedEventId)
    if(eventList){
      const result = eventList.locationList.find(object => object.userId === myId)
      if(result){
        res.lat = req.body.lat
        res.lng = req.body.lng
        await eventList.save()
      }else{
        eventList.locationList.push(req.body)
        await eventList.save()
      }
      res.status(200).json(eventList)
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.put('/bbc/eventlists/updateEvent/:selectedMyEvent', async (req, res) => {
  const { selectedMyEvent } = req.params;
  try {
    const updatedEvent = await EventList.findByIdAndUpdate(selectedMyEvent, req.body, { new: true });
    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.status(200).json(updatedEvent);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/bbc/eventlists/updateEvent/:selectedMyEvent',async(req,res) =>{
  const {selectedMyEvent} = req.params
  try{  
    const eventList = await EventList.findById(selectedMyEvent)
    if (eventList) {
      res.status(200).json(eventList);
    } else {
      res.status(200).json({message:'Not Found'});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.delete('/bbc/eventlists/:selectedEventId', async (req, res) => {
  const { selectedEventId } = req.params;
  try {
    const eventList = await EventList.findByIdAndRemove(selectedEventId);
    if (!eventList) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.status(200).json({ message: 'Event deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//
app.post('/bbc/eventlists',async (req,res) => {
  try{
    const event = new EventList(req.body)
    await event.save()
    res.json(event)
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/bbc/eventlists/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const eventList = await EventList.find({ createrId: userId });
    if (eventList.length > 0) {
      res.status(200).json(eventList);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/bbc/eventlists',async (req,res) => {
  try{
    const eventList =  await EventList.find()
    if(!eventList) throw new Error('no event list')
    res.status(200).json(eventList)
  }catch(error){
    res.status(500).json({message:error.message})
  }
})

//blockedListSchema
app.get('/bbc/blockedlists/:selectedUser/blockeds/:userId',async (req,res) =>{
  const {selectedUser, userId} = req.params
  try{
    const blockedlist = await BlockedList.findOne({userId : selectedUser})
    if (!blockedlist) throw new Error('blockedList list not found');
    const result = blockedlist.blockeds.find(object => object.selectedUserId === userId)
    if(result){
      res.status(200).json(result)
    }else{
      res.status(200).json({message:'Not Blocked From user'})
    }
  }catch(error){
    res.status(500).json({message:error.message})
  }
})


app.delete('/bbc/blockedlists/:userId/blockeds/:selectedUser',async (req,res) => {
  const { userId, selectedUser } = req.params;
  try {
    const blockedList = await BlockedList.findOne({ userId: userId });
    if (!blockedList) {
      res.status(404).json({ message: 'blockedList list not found' });
      return;
    }
    blockedList.blockeds = blockedList.blockeds.filter((friend) => friend.selectedUserId !== selectedUser);
    const updatedBlockedList = await blockedList.save();
    res.status(200).json(updatedBlockedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


app.get('/bbc/blockedlists/:userId/blockeds',async (req,res) => {
  const {userId} = req.params
  try {
    const blockedlist = await BlockedList.findOne({ userId });
    if (!blockedlist) throw new Error('blockedList list not found');

    res.status(200).json(blockedlist.blockeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.post('/bbc/blockedlists/:userId/blockeds',async (req,res) =>{
  const {userId} = req.params
  const { selectedUserId, name, email } = req.body;
  try {
    const user = { selectedUserId, name, email };
    const blockedList = await BlockedList.findOneAndUpdate(
      { userId },
      { $push: { blockeds: user } },
      { new: true, upsert: true }
    );
    res.status(200).json(blockedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

//friend requests
app.post('/bbc/friendlists/:userId/friends', async (req, res) => {
  const { userId } = req.params;
  const { selectedUserId, name, email } = req.body;

  try {
    const friend = { selectedUserId, name, email };
    const friendList = await FriendList.findOneAndUpdate(
      { userId },
      { $push: { friends: friend } },
      { new: true, upsert: true }
    );
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/bbc/friendlists/:userId/friends', async (req, res) => {
  const { userId } = req.params;
  try {
    let users = await User.find()
    const friendList = await FriendList.findOne({ userId });
    if(users.length > 0  && friendList){
      let newFriendList = []
      friendList.friends.forEach(element => {
        const result = users.find(object => String(object._id) === String(element.selectedUserId))
        if(result){
          newFriendList.push(result)
        }
      });
      res.status(200).json({friends:friendList.friends,friendListUpdated:newFriendList});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/bbc/friendlists/:userId/friends/:friendId', async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const friendList = await FriendList.findOne({ userId: userId });
    if (!friendList) {
      res.status(404).json({ message: 'Friend list not found' });
      return;
    }
    friendList.friends = friendList.friends.filter((friend) => friend.selectedUserId !== friendId);
    const updatedFriendList = await friendList.save();
    res.status(200).json(updatedFriendList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//user
/*       friendList.friends.pull({ selectedUserId: friendId });
      await friendList.save();
      res.status(200).json(friendList); */
app.delete('/bbc/users/:id/locationInformations', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $unset: { locationInformations: 1 } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/bbc/users/:id/locationInformations', async (req, res) => {
  const { id } = req.params;
  const { details } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "locationInformations.details": details },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.delete('/bbc/users/:id/userImages/:imageId', async (req, res) => {
  const { id, imageId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          userImages: { _id: imageId },
        },
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.put('/bbc/users/:id',async (req,res) =>{
  const {id} = req.params
  try{
    const user = await User.findByIdAndUpdate(id,req.body,{
      new:true
    })
    if(!user){
      return res.status(404).json({message:'User Not Found'})
    }
    res.json(user)
  }catch(error){
    console.error(error)
    res.status(500).json({message:'Internal Server Error'})
  }
})


app.post('/bbc/users/:id/userImages', async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newImage = { image, inDb: true };
    user.userImages.push({ image: newImage });
    await user.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//selectedUserInformations

app.get('/bbc/users/:id',async (req,res) => {
  const {id} = req.params
  try{
    const user = await User.findOne({_id : id})
    if(!user){
      res.status(404).json({ message: 'User not found' });
      return;
    }else{
      res.status(200).json(user)
    }
  }catch(error){
    console.error(error)
    res.status(500).json({message:'Internal Server Error'})
  }
})

//

app.put('/bbc/users/:userId/changeProfileImage',async (req,res)=>{
  const {userId} = req.params
  try{
    const user = await User.findById(userId)
    user.userImage = req.body.image.image
    await user.save()
    res.status(200).json(user)
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
})

app.get('/bbc/users',async (req,res) =>{
  try{
    const users = await User.find()
    res.status(200).json(users)
  }catch(error){
    console.error(error)
    res.status(500).json({message:'Inter Server Error'})
  }
})

app.post('/bbc/users/', async (req, res) => {
  try {
    const userEmail = req.body.email;
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      const newUser = new User(req.body);
      await newUser.save();
      res.json(newUser);
    } else {
      await existingUser.updateOne({
        online:true
      })
      res.status(200).json(existingUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

User.watch((err,results) =>{
  if(err){
    console.log(err)
  }else{
    console.log(results)
  }
})


app.listen(8000,() => {
    console.log('server running')
})