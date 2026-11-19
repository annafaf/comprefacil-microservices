const EMAIL_RE=/^\S+@\S+\.\S+$/;
function validatePaymentInput(body){
 const {customerName,customerEmail,amount}=body||{};
 if(typeof customerName!=='string'||!customerName.trim())return {error:'customerName é obrigatório'};
 const email=typeof customerEmail==='string'?customerEmail.trim():'';
 if(!EMAIL_RE.test(email))return {error:'customerEmail inválido'};
 const value=Number(amount);
 if(typeof amount==='boolean'||!Number.isFinite(value)||value<=0)return {error:'amount deve ser maior que zero'};
 return {data:{customerName:customerName.trim(),customerEmail:email,amount:value}};
}
module.exports={validatePaymentInput};
