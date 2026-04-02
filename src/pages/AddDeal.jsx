import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { generateID } from "../utils/idGenerator";

export default function AddDeal() {

const [cps,setCps] = useState([]);

const [form,setForm] = useState({

cp_id:"",
entity_type:"Individual",

applicant1_name:"",
applicant1_dob:"",
applicant1_phone:"",
applicant1_email:"",
applicant1_address:"",

applicant2_name:"",
applicant2_dob:"",
applicant2_phone:"",
applicant2_email:"",
applicant2_address:"",

relationship:"",

project_name:"",
plot_number:"",
plot_size:"",
plot_value:"",

booking_amount_paid:"",
balance_amount:"",
balance_due_date:"",

payment_mode:"",
booking_date:"",

documents_received:false

});

useEffect(()=>{
loadCPs();
},[]);


async function loadCPs(){

const {data} = await supabase
.from("channel_partners")
.select("*");

setCps(data || []);

}


/* UPDATE FIELD */

function updateField(field,value){

let updated = {
...form,
[field]:value
};

/* AUTO CALCULATE BALANCE */

if(field==="plot_value" || field==="booking_amount_paid"){

const plot = Number(field==="plot_value"?value:form.plot_value);
const booking = Number(field==="booking_amount_paid"?value:form.booking_amount_paid);

if(plot && booking){

updated.balance_amount = plot - booking;

}

}

setForm(updated);

}


/* SAVE DEAL */

async function saveDeal(){

if(!form.cp_id){
alert("Select Channel Partner");
return;
}

const cp = cps.find(c => c.id === Number(form.cp_id));

const rm_id = cp?.rm_id;

if(!rm_id){
alert("RM not mapped with CP");
return;
}

if(!form.applicant1_name){
alert("Applicant Name required");
return;
}

/* CREATE CLIENT */

const {data:client,error:clientError} = await supabase
.from("clients")
.insert([{
name:form.applicant1_name,
phone:form.applicant1_phone,
email:form.applicant1_email,
address:form.applicant1_address,
cp_id:form.cp_id,
rm_id:rm_id,
status:"booked"
}])
.select()
.single();

if(clientError){
console.log(clientError);
alert("Client save error");
return;
}


/* CREATE SALE */

const {data:sale,error:saleError} = await supabase
.from("sales")
.insert([{

sale_code: generateID("SALE"),

client_id:client.id,

cp_id:form.cp_id,
rm_id:rm_id,

entity_type:form.entity_type,

project_name:form.project_name,
plot_number:form.plot_number,
plot_size:form.plot_size,

plot_value:form.plot_value,

booking_amount_paid:form.booking_amount_paid,

balance_amount:form.balance_amount,
balance_due_date:form.balance_due_date,

payment_mode:form.payment_mode,
booking_date:form.booking_date,

documents_received:form.documents_received,

amount:form.plot_value,
product:"Property Sale"

}])
.select()
.single();

if(saleError){
console.log(saleError);
alert("Sale save error");
return;
}


/* APPLICANT 1 */

await supabase
.from("applicants")
.insert([{

sale_id:sale.id,
applicant_role:"Applicant",

name:form.applicant1_name,
dob:form.applicant1_dob,
phone:form.applicant1_phone,
email:form.applicant1_email,
address:form.applicant1_address

}]);


/* APPLICANT 2 */

if(form.applicant2_name){

let role = "Co-Applicant";

if(form.entity_type==="Company") role="Authorized Signatory";
if(form.entity_type==="Trust") role="Authorized Signatory";
if(form.entity_type==="HUF") role="Karta";
if(form.entity_type==="Minor") role="Guardian";

await supabase
.from("applicants")
.insert([{

sale_id:sale.id,
applicant_role:role,

name:form.applicant2_name,
dob:form.applicant2_dob,
phone:form.applicant2_phone,
email:form.applicant2_email,
address:form.applicant2_address,
relationship:form.relationship

}]);

}


/* UPDATE LEAD PIPELINE */

if(form.applicant1_phone){

await supabase
.from("leads")
.update({status:"Booked"})
.eq("phone",form.applicant1_phone);

}


alert("Deal Saved Successfully");

resetForm();

}


/* RESET FORM */

function resetForm(){

setForm({

cp_id:"",
entity_type:"Individual",

applicant1_name:"",
applicant1_dob:"",
applicant1_phone:"",
applicant1_email:"",
applicant1_address:"",

applicant2_name:"",
applicant2_dob:"",
applicant2_phone:"",
applicant2_email:"",
applicant2_address:"",

relationship:"",

project_name:"",
plot_number:"",
plot_size:"",
plot_value:"",

booking_amount_paid:"",
balance_amount:"",
balance_due_date:"",

payment_mode:"",
booking_date:"",

documents_received:false

});

}


/* UI */

return(

<div style={container}>

<h1>Add Deal</h1>

<div style={formBox}>

<label>Channel Partner</label>

<select
value={form.cp_id}
onChange={(e)=>updateField("cp_id",e.target.value)}
>
<option value="">Select CP</option>

{cps.map(cp=>(
<option key={cp.id} value={cp.id}>
{cp.name}
</option>
))}
</select>


<label>Entity Type</label>

<select
value={form.entity_type}
onChange={(e)=>updateField("entity_type",e.target.value)}
>

<option>Individual</option>
<option>Joint Applicants</option>
<option>Company</option>
<option>Trust</option>
<option>HUF</option>
<option>Minor</option>

</select>


<h3>Applicant 1</h3>

<input placeholder="Name"
value={form.applicant1_name}
onChange={(e)=>updateField("applicant1_name",e.target.value)}
/>

<input type="date"
value={form.applicant1_dob}
onChange={(e)=>updateField("applicant1_dob",e.target.value)}
/>

<input placeholder="Phone"
value={form.applicant1_phone}
onChange={(e)=>updateField("applicant1_phone",e.target.value)}
/>

<input placeholder="Email"
value={form.applicant1_email}
onChange={(e)=>updateField("applicant1_email",e.target.value)}
/>

<input placeholder="Address"
value={form.applicant1_address}
onChange={(e)=>updateField("applicant1_address",e.target.value)}
/>


<h3>Applicant 2 / Signatory</h3>

<input placeholder="Name"
value={form.applicant2_name}
onChange={(e)=>updateField("applicant2_name",e.target.value)}
/>

<input type="date"
value={form.applicant2_dob}
onChange={(e)=>updateField("applicant2_dob",e.target.value)}
/>

<input placeholder="Phone"
value={form.applicant2_phone}
onChange={(e)=>updateField("applicant2_phone",e.target.value)}
/>

<input placeholder="Email"
value={form.applicant2_email}
onChange={(e)=>updateField("applicant2_email",e.target.value)}
/>

<input placeholder="Address"
value={form.applicant2_address}
onChange={(e)=>updateField("applicant2_address",e.target.value)}
/>


{form.entity_type==="Minor" && (

<input placeholder="Relationship with Minor"
value={form.relationship}
onChange={(e)=>updateField("relationship",e.target.value)}
/>

)}


<h3>Property Details</h3>

<select
value={form.project_name}
onChange={(e)=>updateField("project_name",e.target.value)}
>

<option value="">Select Project</option>

<option>Deep Homes</option>
<option>Deep Town Block B</option>
<option>Deep City Phase 2</option>
<option>Deep City Phase 4</option>
<option>Deep Commercials</option>
<option>Others</option>

</select>


<input placeholder="Plot Number"
value={form.plot_number}
onChange={(e)=>updateField("plot_number",e.target.value)}
/>

<input placeholder="Plot Size (Sq Yards)"
value={form.plot_size}
onChange={(e)=>updateField("plot_size",e.target.value)}
/>

<input placeholder="Plot Value"
value={form.plot_value}
onChange={(e)=>updateField("plot_value",e.target.value)}
/>


<h3>Payment</h3>

<input placeholder="Booking Amount"
value={form.booking_amount_paid}
onChange={(e)=>updateField("booking_amount_paid",e.target.value)}
/>

<input placeholder="Balance Amount"
value={form.balance_amount}
readOnly
/>

<label>Balance Due Date</label>

<input type="date"
value={form.balance_due_date}
onChange={(e)=>updateField("balance_due_date",e.target.value)}
/>

<input placeholder="Payment Mode"
value={form.payment_mode}
onChange={(e)=>updateField("payment_mode",e.target.value)}
/>

<label>Booking Date</label>

<input type="date"
value={form.booking_date}
onChange={(e)=>updateField("booking_date",e.target.value)}
/>


<label>

<input type="checkbox"
checked={form.documents_received}
onChange={(e)=>updateField("documents_received",e.target.checked)}
/>

Documents received by RM

</label>


<button onClick={saveDeal}>
Save Deal
</button>

</div>

</div>

);

}

const container={
padding:40,
fontFamily:"Arial"
};

const formBox={
display:"flex",
flexDirection:"column",
gap:10,
maxWidth:450
};