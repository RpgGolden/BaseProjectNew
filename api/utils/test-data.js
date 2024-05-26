// import { doctors } from '../config/test-data.js';
// import Doctor from '../models/doctor.js';

// async function fillDoctors() {
//     for (const x of doctors) {
//         const doctor = await Doctor.findOne({
//             where: {
//                 name: x.name,
//                 surname: x.surname,
//                 patronymic: x.patronymic,
//                 specialist: x.specialist,
//             },
//         });
//         if (!doctor) {
//             await Doctor.create({
//                 name: x.name,
//                 surname: x.surname,
//                 patronymic: x.patronymic,
//                 specialist: x.specialist,
//             });
//         }
//     }
// }

// export default {
//     fillDoctors,
// };
