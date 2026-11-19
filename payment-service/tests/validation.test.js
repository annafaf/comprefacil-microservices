const test=require('node:test');
const assert=require('node:assert/strict');
const {validatePaymentInput}=require('../src/validation');

test('aceita dados válidos e normaliza strings',()=>{
 const result=validatePaymentInput({customerName:' Ana Souza ',customerEmail:' ana@example.com ',amount:149.9});
 assert.equal(result.error,undefined);
 assert.deepEqual(result.data,{customerName:'Ana Souza',customerEmail:'ana@example.com',amount:149.9});
});

test('rejeita customerName ausente ou vazio',()=>{
 assert.equal(validatePaymentInput({customerEmail:'a@b.com',amount:10}).error,'customerName é obrigatório');
 assert.equal(validatePaymentInput({customerName:'   ',customerEmail:'a@b.com',amount:10}).error,'customerName é obrigatório');
});

test('rejeita customerEmail inválido',()=>{
 assert.equal(validatePaymentInput({customerName:'Ana',customerEmail:'invalido',amount:10}).error,'customerEmail inválido');
});

test('rejeita amount menor ou igual a zero',()=>{
 assert.equal(validatePaymentInput({customerName:'Ana',customerEmail:'a@b.com',amount:0}).error,'amount deve ser maior que zero');
 assert.equal(validatePaymentInput({customerName:'Ana',customerEmail:'a@b.com',amount:-5}).error,'amount deve ser maior que zero');
});

test('rejeita amount não numérico',()=>{
 assert.equal(validatePaymentInput({customerName:'Ana',customerEmail:'a@b.com',amount:'abc'}).error,'amount deve ser maior que zero');
});
