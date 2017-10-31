export function isValidISBN (isbn) {
    isbn = isbn.replace(/[^\dX]/gi, '');
    if(isbn.length !== 10){
        return false;
    }
    var chars = isbn.split('');
    if(chars[9].toUpperCase() === 'X'){
        chars[9] = 10;
    }
    var sum = 0;
    for (var i = 0; i < chars.length; i++) {
        sum += ((10-i) * parseInt(chars[i]));
    };
    return ((sum % 11) === 0);
}