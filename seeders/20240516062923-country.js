'use strict';

const { Countries, State } = require('../models'); // Adjust the path if needed

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let country = []; // Declare outside the loop
    const countryNames = ['Afghanistan', "land Islands", "Albania", "Algeria", "American Samoa", "AndorrA", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, The Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote D\"Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic Of", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People\"S Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People\"S Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "RWANDA", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan"]
    for (let index = 0; index < countryNames.length; index++) {
      country.push({
        name: countryNames[index],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('countries', country);

    let countries = await Countries.findAll();

    let states = [];
    let cities = [];
    let stateData = {
      India: [{
        'Andaman and Nicobar Islands': ["Nicobar", "North and Middle Andaman", "South Andaman"],
        'Andhra Pradesh': ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
        'Arunachal Pradesh': ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
        'Assam': ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
        'Bihar': ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
        'Chandigarh': ["Chandigarh"],
        'Chhattisgarh': ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
        'Dadra and Nagar Haveli': ["Dadra and Nagar Haveli"],
        'Daman and Diu': ["Daman", "Diu"],
        'Delhi': ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
        'Goa': ["North Goa", "South Goa"],
        'Gujarat': ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
        'Haryana': ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
        'Himachal Pradesh': ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
        'Jammu and Kashmir': ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
        'Jharkhand': ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
        'Karnataka': ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
        'Kerala': ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
        'Ladakh': ["Kargil", "Leh"],
        'Lakshadweep': ["Agatti", "Amini", "Androth", "Bithra", "Chethlath", "Kavaratti", "Kalpeni", "Kadmat", "Kilthan", "Minicoy"],
        'Madhya Pradesh': ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
        'Maharashtra': ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
        'Manipur': ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
        'Meghalaya': ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri-Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
        'Mizoram': ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
        'Nagaland': ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
        'Odisha': ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"],
        'Puducherry': ["Karaikal", "Mahe", "Puducherry", "Yanam"],
        'Punjab': ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"],
        'Rajasthan': ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
        'Sikkim': ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
        'Tamil Nadu': ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
        'Telangana': ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
        'Tripura': ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
        'Uttarakhand': ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
        'Uttar Pradesh': ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
        'West Bengal': ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
      }],
      Afghanistan: [{ "Badakhshān": [], "Baghlān": [], "Balkh": [], "Bādghīs": [], "Bāmyān": [], "Dāykundī": [], "Farāh": [], "Fāryāb": [], "Ghaznī": [], "Ghōr": [], "Helmand": [], "Herāt": [], "Jowzjān": [], "Kandahār": [], "Khōst": [], "Kunar": [], "Kunduz": [], "Kābul": [], "Kāpīsā": [], "Laghmān": [], "Lōgar": [], "Nangarhār": [], "Nīmrōz": [], "Nūristān": [], "Paktiyā": [], "Paktīkā": [], "Panjshayr": [], "Parwān": [], "Samangān": [], "Sar-e Pul": [], "Takhār": [], "Uruzgān": [], "Wardak": [], "Zābul": [] }],
      "Åland Islands": [{ "Fasta Åland": [], "Brändö": [], "Eckerö": [], "Finström": [], "Föglö": [], "Geta": [], "Hammarland": [], "Jomala": [], "Kumlinge": [], "Kökar": [], "Lemland": [], "Lumparland": [], "Mariehamn": [], "Saltvik": [], "Sottunga": [], "Sund": [], "Vårdö": [] }],
      Albania: [{ "Berat": [], "Dibër": [], "Durrës": [], "Elbasan": [], "Fier": [], "Gjirokastër": [], "Korçë": [], "Kukës": [], "Lezhë": [], "Shkodër": [], "Tiranë": [], "Vlorë": [] }],
      Algeria: [{ "Adrar": [], "Chlef": [], "Laghouat": [], "Oum El Bouaghi": [], "Batna": [], "Béjaïa": [], "Biskra": [], "Béchar": [], "Blida": [], "Bouira": [], "Tamanrasset": [], "Tébessa": [], "Tlemcen": [], "Tiaret": [], "Tizi Ouzou": [], "Alger": [], "Djelfa": [], "Jijel": [], "Sétif": [], "Saïda": [], "Skikda": [], "Sidi Bel Abbès": [], "Annaba": [], "Guelma": [], "Constantine": [], "Médéa": [], "Mostaganem": [], "M'Sila": [], "Mascara": [], "Ouargla": [], "Oran": [], "El Bayadh": [], "Illizi": [], "Bordj Bou Arréridj": [], "Boumerdès": [], "El Tarf": [], "Tindouf": [], "Tissemsilt": [], "El Oued": [], "Khenchela": [], "Souk Ahras": [], "Tipaza": [], "Mila": [], "Aïn Defla": [], "Naâma": [], "Aïn Témouchent": [], "Ghardaïa": [], "Relizane": [] }],
      "American Samoa": [{ "Western District": [], "Eastern District": [], "Manu'a District": [], "Rose Island": [] }],
      AndorrA: [{ "Andorra la Vella": [], "Canillo": [], "Encamp": [], "Escaldes-Engordany": [], "La Massana": [], "Ordino": [], "Sant Julià de Lòria": [] }],
      Angola: [{ "Bengo": [], "Benguela": [], "Bié": [], "Cabinda": [], "Cuando Cubango": [], "Cuanza Norte": [], "Cuanza Sul": [], "Cunene": [], "Huambo": [], "Huíla": [], "Luanda": [], "Lunda Norte": [], "Lunda Sul": [], "Malanje": [], "Moxico": [], "Namibe": [], "Uíge": [], "Zaire": [] }],
      "Antarctica": [{ "Antarctica": [] }],
      Argentina: [{ "Buenos Aires": [], "Catamarca": [], "Chaco": [], "Chubut": [], "Ciudad Autónoma de Buenos Aires": [], "Córdoba": [], "Corrientes": [], "Entre Ríos": [], "Formosa": [], "Jujuy": [], "La Pampa": [], "La Rioja": [], "Mendoza": [], "Misiones": [], "Neuquén": [], "Río Negro": [], "Salta": [], "San Juan": [], "San Luis": [], "Santa Cruz": [], "Santa Fe": [], "Santiago del Estero": [], "Tierra del Fuego, Antártida e Islas del Atlántico Sur": [], "Tucumán": [] }],
      Armenia: [{ "Aragatsotn": [], "Ararat": [], "Armavir": [], "Gegharkunik": [], "Kotayk": [], "Lori": [], "Shirak": [], "Syunik": [], "Tavush": [], "Vayots Dzor": [], "Yerevan": [] }],
      "Aruba": [{ "Aruba": [] }],
      "Australia": [{ "Australian Capital Territory": [], "New South Wales": [], "Northern Territory": [], "Queensland": [], "South Australia": [], "Tasmania": [], "Victoria": [], "Western Australia": [] }],
      "Austria": [{ "Burgenland": [], "Carinthia": [], "Lower Austria": [], "Upper Austria": [], "Salzburg": [], "Styria": [], "Tyrol": [], "Vorarlberg": [], "Vienna": [] }],
      "Azerbaijan ": [{ "Absheron": [], "Agcabadi": [], "Agdam": [], "Agdash": [], "Agstafa": [], "Agsu": [], "Agsu": [], "Ali Bayramli": [], "Astara": [], "Babek": [], "Baku": [], "Balakan": [], "Barda": [], "Beylaqan": [], "Bilasuvar": [], "Dashkasan": [], "Fizuli": [], "Gadabay": [], "Ganja": [], "Goranboy": [], "Goychay": [], "Goygol": [], "Hajigabul": [], "Imishli": [], "Ismayilli": [], "Jabrayil": [], "Julfa": [], "Kalbajar": [], "Kangarli": [], "Khachmaz": [], "Khojavend": [], "Kurdamir": [], "Lachin": [], "Lankaran": [], "Lankaran": [], "Lerik": [], "Masally": [], "Mingachevir": [], "Nakhchivan Autonomous Republic": [], "Neftchala": [], "Oguz": [], "Ordubad": [], "Qabala": [], "Qakh": [], "Qazakh": [], "Quba": [], "Qubadli": [], "Qusar": [], "Saatly": [], "Sabirabad": [], "Sadarak": [], "Salyan": [], "Samukh": [], "Shabran": [], "Shahbuz": [], "Shaki": [], "Shamakhi": [], "Shamkir": [], "Sharur": [], "Shirvan": [], "Siazan": [], "Sumqayit": [], "Tartar": [], "Tovuz": [], "Ujar": [], "Yardimli": [], "Yevlakh": [], "Zangilan": [], "Zaqatala": [], "Zardab": [] }],
      "Bahamas": [{ "Acklins and Crooked Islands": [], "Berry Islands": [], "Bimini": [], "Black Point": [], "Cat Island": [], "Central Abaco": [], "Central Andros": [], "Central Eleuthera": [], "City of Freeport": [], "Crooked Island and Long Cay": [], "East Grand Bahama": [], "Exuma": [], "Grand Cay": [], "Harbour Island": [], "Hope Town": [], "Inagua": [], "Long Island": [], "Mangrove Cay": [], "Mayaguana": [], "Moore’s Island": [], "North Abaco": [], "North Andros": [], "North Eleuthera": [], "Ragged Island": [], "Rum Cay": [], "San Salvador": [], "South Abaco": [], "South Andros": [], "South Eleuthera": [], "Spanish Wells": [], "West Grand Bahama": [] }],
      "Bahrain": [{ "Capital Governorate": [], "Central Governorate": [], "Muharraq Governorate": [], "Northern Governorate": [], "Southern Governorate": [] }],
      "Bangladesh": [{ "Barisal": [], "Chittagong": [], "Dhaka": [], "Khulna": [], "Mymensingh": [], "Rajshahi": [], "Rangpur": [], "Sylhet": [] }],
      "Barbados": [{ "Christ Church": [], "Saint Andrew": [], "Saint George": [], "Saint James": [], "Saint John": [], "Saint Joseph": [], "Saint Lucy": [], "Saint Michael": [], "Saint Peter": [], "Saint Philip": [], "Saint Thomas": [] }],
      "Belarus": [{ "Brest Region": [], "Gomel Region": [], "Grodno Region": [], "Minsk": [], "Minsk Region": [], "Mogilev Region": [], "Vitebsk Region": [] }],
      "Belgium": [{ "Antwerp": [], "East Flanders": [], "Flemish Brabant": [], "Hainaut": [], "Liege": [], "Limburg": [], "Luxembourg": [], "Namur": [], "Walloon Brabant": [], "West Flanders": [] }],
      "Belize": [{ "Belize": [], "Cayo": [], "Corozal": [], "Orange Walk": [], "Stann Creek": [], "Toledo": [] }],
      "British Indian Ocean Territory": [{ "British Indian Ocean Territory": [] }],
      "Brunei Darussalam": [{ "Brunei Darussalam": [] }],
    };
    for (let i = 0; i < countries.length; i++) {
      const countryName = countries[i].name;
      const countryId = countries[i].id;
      const countryStates = stateData[countryName];

      if (countryStates) {
        for (let j = 0; j < countryStates.length; j++) {
          const stateEntries = Object.entries(countryStates[j]);
          for (let [stateName, citiesArray] of stateEntries) {
            states.push({
              name: stateName,
              countryId,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            if (Array.isArray(citiesArray)) {
              for (let k = 0; k < citiesArray.length; k++) {
                const stateId = states.length;
                cities.push({
                  name: citiesArray[k],
                  stateswithcityId: stateId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
            }
          }
        }
      }
    }


    await queryInterface.bulkInsert('staties', states);
    await queryInterface.bulkInsert('cities', cities);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('countries', null, {});
    await queryInterface.bulkDelete('staties', null, {});
    await queryInterface.bulkDelete('cities', null, {});
  }
};
