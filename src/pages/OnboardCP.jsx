import { useState } from "react";
import { supabase } from "../supabaseClient";
import { generateID } from "../utils/idGenerator";

export default function OnboardCP(){

const [form,setForm] = useState({

name:"",
dob:"",
phone:"",
email:"",

address:"",
city:"",
state:"",

cp_type:"Individual",

company_name:"",
company_phone:"",
company_email:"",
company_address:"",
company_city:"",
company_state:"",

contact_person:"",
contact_person_phone:"",

industry:"",
employees:"",
operating_markets:"",
expected_business:"",

training_required:"No",
training_date:"",
training_time:"",

gst:"",
rera:"",
pan:"",

remarks:""

});

const [photo,setPhoto] = useState(null)
const [addressProof,setAddressProof] = useState(null)
const [panDoc,setPanDoc] = useState(null)
const [reraDoc,setReraDoc] = useState(null)
const [gstDoc,setGstDoc] = useState(null)



function updateField(field,value){

setForm(prev=>({
...prev,
[field]:value
}))

}



/* FILE UPLOAD */

async function uploadFile(file){

if(!file) return null

const fileName = Date.now()+"_"+file.name

const {error} = await supabase
.storage
.from("cp-documents")
.upload(fileName,file)

if(error){
console.log(error)
return null
}

return fileName

}



/* SAVE CP */

async function saveCP(){

const user = JSON.parse(sessionStorage.getItem("user"))

if(!user){
alert("Session expired")
return
}

const rm_id = user.id

if(!form.name){
alert("Name required")
return
}

if(!form.phone){
alert("Phone required")
return
}



/* UPLOAD DOCUMENTS */

const photoUrl = await uploadFile(photo)
const addressUrl = await uploadFile(addressProof)
const panUrl = await uploadFile(panDoc)
const reraUrl = await uploadFile(reraDoc)
const gstUrl = await uploadFile(gstDoc)



/* INSERT CP */

const {error} = await supabase
.from("channel_partners")
.insert([{

cp_uid: generateID("CP"),

rm_id: rm_id,

name:form.name,
dob:form.dob,
phone:form.phone,
email:form.email,

address:form.address,
city:form.city,
state:form.state,

cp_type:form.cp_type,

company_name:form.company_name,
company_phone:form.company_phone,
company_email:form.company_email,
company_address:form.company_address,
company_city:form.company_city,
company_state:form.company_state,

contact_person:form.contact_person,
contact_person_phone:form.contact_person_phone,

industry:form.industry,
employees:form.employees,
operating_markets:form.operating_markets,
expected_business:form.expected_business,

training_required:form.training_required,
training_date:form.training_date,
training_time:form.training_time,

gst:form.gst,
rera:form.rera,
pan:form.pan,

address_proof_url:addressUrl,

rm_remarks:form.remarks,

status:"active"

}])

if(error){

console.log(error)
alert("Error saving CP")

return

}

alert("Channel Partner Added Successfully")

resetForm()

}



/* RESET FORM */

function resetForm(){

setForm({

name:"",
dob:"",
phone:"",
email:"",

address:"",
city:"",
state:"",

cp_type:"Individual",

company_name:"",
company_phone:"",
company_email:"",
company_address:"",
company_city:"",
company_state:"",

contact_person:"",
contact_person_phone:"",

industry:"",
employees:"",
operating_markets:"",
expected_business:"",

training_required:"No",
training_date:"",
training_time:"",

gst:"",
rera:"",
pan:"",

remarks:""

})

setPhoto(null)
setAddressProof(null)
setPanDoc(null)
setReraDoc(null)
setGstDoc(null)

}



/* UI */

return(

<div style={container}>

<h1>Channel Partner Onboarding</h1>

<div style={formBox}>

<h3>Personal Details</h3>

<input
placeholder="Name"
value={form.name}
onChange={(e)=>updateField("name",e.target.value)}
/>

<label>DOB</label>
<input
type="date"
value={form.dob}
onChange={(e)=>updateField("dob",e.target.value)}
/>

<input
placeholder="Phone"
value={form.phone}
onChange={(e)=>updateField("phone",e.target.value)}
/>

<input
placeholder="Email"
value={form.email}
onChange={(e)=>updateField("email",e.target.value)}
/>

<input
placeholder="Address"
value={form.address}
onChange={(e)=>updateField("address",e.target.value)}
/>

<input
placeholder="City"
value={form.city}
onChange={(e)=>updateField("city",e.target.value)}
/>

<input
placeholder="State"
value={form.state}
onChange={(e)=>updateField("state",e.target.value)}
/>



<h3>CP Type</h3>

<select
value={form.cp_type}
onChange={(e)=>updateField("cp_type",e.target.value)}
>

<option>Individual</option>
<option>Company</option>
<option>Investor Referral</option>

</select>



<h3>Company Details</h3>

<input
placeholder="Company Name"
value={form.company_name}
onChange={(e)=>updateField("company_name",e.target.value)}
/>

<input
placeholder="Company Phone"
value={form.company_phone}
onChange={(e)=>updateField("company_phone",e.target.value)}
/>

<input
placeholder="Company Email"
value={form.company_email}
onChange={(e)=>updateField("company_email",e.target.value)}
/>

<input
placeholder="Company Address"
value={form.company_address}
onChange={(e)=>updateField("company_address",e.target.value)}
/>

<input
placeholder="Company City"
value={form.company_city}
onChange={(e)=>updateField("company_city",e.target.value)}
/>

<input
placeholder="Company State"
value={form.company_state}
onChange={(e)=>updateField("company_state",e.target.value)}
/>



<h3>Contact Person</h3>

<input
placeholder="Contact Person Name"
value={form.contact_person}
onChange={(e)=>updateField("contact_person",e.target.value)}
/>

<input
placeholder="Contact Person Phone"
value={form.contact_person_phone}
onChange={(e)=>updateField("contact_person_phone",e.target.value)}
/>



<h3>Business Profile</h3>

<input
placeholder="Industry"
value={form.industry}
onChange={(e)=>updateField("industry",e.target.value)}
/>

<input
placeholder="No of Employees"
value={form.employees}
onChange={(e)=>updateField("employees",e.target.value)}
/>

<input
placeholder="Operating Markets"
value={form.operating_markets}
onChange={(e)=>updateField("operating_markets",e.target.value)}
/>

<input
placeholder="Expected Business PM"
value={form.expected_business}
onChange={(e)=>updateField("expected_business",e.target.value)}
/>



<h3>Training</h3>

<select
value={form.training_required}
onChange={(e)=>updateField("training_required",e.target.value)}
>

<option>No</option>
<option>Yes</option>

</select>

<input
type="date"
value={form.training_date}
onChange={(e)=>updateField("training_date",e.target.value)}
/>

<input
type="time"
value={form.training_time}
onChange={(e)=>updateField("training_time",e.target.value)}
/>



<h3>Compliance</h3>

<input
placeholder="GST No"
value={form.gst}
onChange={(e)=>updateField("gst",e.target.value)}
/>

<input
placeholder="RERA No"
value={form.rera}
onChange={(e)=>updateField("rera",e.target.value)}
/>

<input
placeholder="PAN No"
value={form.pan}
onChange={(e)=>updateField("pan",e.target.value)}
/>



<h3>Documents</h3>

<label>Photo</label>
<input type="file" onChange={(e)=>setPhoto(e.target.files[0])}/>

<label>Address Proof</label>
<input type="file" onChange={(e)=>setAddressProof(e.target.files[0])}/>

<label>PAN</label>
<input type="file" onChange={(e)=>setPanDoc(e.target.files[0])}/>

<label>RERA</label>
<input type="file" onChange={(e)=>setReraDoc(e.target.files[0])}/>

<label>GST</label>
<input type="file" onChange={(e)=>setGstDoc(e.target.files[0])}/>



<h3>RM Remarks</h3>

<textarea
value={form.remarks}
onChange={(e)=>updateField("remarks",e.target.value)}
/>



<button onClick={saveCP}>
Save Channel Partner
</button>

</div>

</div>

)

}



const container={
padding:40,
fontFamily:"Arial",
maxWidth:600,
margin:"auto"
}

const formBox={
display:"flex",
flexDirection:"column",
gap:10
}