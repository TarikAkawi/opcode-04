const courses = [
    { id: 1, title: 'Intro to CS in Java', credits: 6 },
    { id: 2, title: 'Linear Algebra 1', credits: 7 },
    { id: 3, title: 'Discrete Mathematics', credits: 4 },
    { id: 4, title: 'Programming Systems Workshop', credits: 4 },
    { id: 5, title: 'Linear Algebra 2', credits: 5 },
    { id: 6, title: 'Calculus 1', credits: 7 },
]

const students = [
  {
    id: 1,
    name: 'Alice Brown',
    grades: [
      { grade: 98, course: 1 },
      { grade: 95, course: 4 },
      { grade: 92, course: 2 },
      { grade: 90, course: 6 }
    ]
  },
  {
    id: 2,
    name: 'Bob Smith',
    grades: [
      { grade: 80, course: 1 },
      { grade: 100, course: 3 },
      { grade: 95, course: 5 },
    ]
  },
  {
    id: 3,
    name: 'Charlie Johnson',
    grades: [
      { grade: 91, course: 1 },
      { grade: 60, course: 3 },
      { grade: 61, course: 4 }
    ]
  },
  {
    id: 4,
    name: 'Dana Levi',
    grades: [
      { grade: 88, course: 2 },
      { grade: 85, course: 4 },
      { grade: 87, course: 1 },
      { grade: 89, course: 6 }
    ]
  },
  {
    id: 5,
    name: 'Emilia Garcia',
    grades: [
      { grade: 61, course: 3 },
      { grade: 60, course: 1 },
      { grade: 75, course: 4 }
    ]
  },
  {
    id: 6,
    name: "Frank O'Connor",
    grades: [
      { grade: 100, course: 4 },
      { grade: 100, course: 1 },
      { grade: 100, course: 5 }
    ]
  },
  {
    id: 7,
    name: 'Gina Kim',
    grades: [
      { grade: 84, course: 2 },
      { grade: 79, course: 3 },
      { grade: 88, course: 4 },
      { grade: 81, course: 6 },
      { grade: 90, course: 1 }
    ]
  },
  {
    id: 8,
    name: 'Hacker Man',
    grades: [
      { grade: 94, course: 1 },
      { grade: 91, course: 4 },
      { grade: 91, course: 2 }
    ]
  },
  {
    id: 9,
    name: 'Ivy Chen',
    grades: [
      { grade: 95, course: 4 },
      { grade: 94, course: 1 },
      { grade: 91, course: 3 }
    ]
  },
  {
    id: 10,
    name: 'John Long',
    grades: [
      { grade: 91, course: 4 },
      { grade: 94, course: 1 }
    ]
  }
];

// Demand number 1
function addStudent(students, student) {
  // בדיקות בסיסיות
  if (!student || typeof student !== "object") {
    throw new Error("אובייקט סטודנט לא תקין");
  }

  if (typeof student.name !== "string" || student.name.trim() === "") {
    throw new Error("שם הסטודנט לא תקין");
  }

  if (
    !student.grades ||
    typeof student.grades !== "object" ||
    Object.keys(student.grades).length === 0
  ) {
    throw new Error("רשימת ציונים לא תקינה");
  }

  // בדיקה שהסטודנט עבר קורסי קדם חובה
  for (const courseId of mandatoryCourseIds) {
    if (!(courseId in student.grades)) {
      throw new Error(
        `הסטודנט לא עבר קורס קדם חובה (מזהה קורס ${courseId})`
      );
    }
  }

  const validCourseIds = courses.map(c => c.id);
  const roundedGrades = {};

  // בדיקות ציונים
  for (const [courseIdStr, grade] of Object.entries(student.grades)) {
    const courseId = Number(courseIdStr);

    // בדיקת קיום קורס
    if (!validCourseIds.includes(courseId)) {
      throw new Error(`קורס עם מזהה ${courseId} לא קיים`);
    }

    if (typeof grade !== "number") {
      throw new Error(`ציון לא מספר בקורס ${courseId}`);
    }

    if (grade < 0 || grade > 100) {
      throw new Error(`ציון בקורס ${courseId} חייב להיות בין 0 ל־100`);
    }

    // עיגול לציון שלם
    roundedGrades[courseId] = Math.round(grade);
  }

  // הקצאת מזהה ייחודי חדש
  const maxId =
    students.length === 0
      ? 0
      : Math.max(...students.map(s => s.id));

  const newStudent = {
    id: maxId + 1,
    name: student.name,
    grades: roundedGrades
  };

  students.push(newStudent);
  return newStudent;
}
// Demand number 2
function getStudentStats(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  // take only the numeric grades
  const grades = student.grades.map(x => x.grade);

  // average
  const average = grades.reduce((sum, g) => sum + g, 0) / grades.length;

  // exception: grade >= average + 20
  const exceptionApproval = grades.some(g => g >= average + 20);

  // improvement: last 2 grades > average
  let hasImprovement = false;
  if (grades.length >= 2) {
    const last = grades[grades.length - 1];
    const secondLast = grades[grades.length - 2];
    hasImprovement = last > average && secondLast > average;
  }

  return { average, exceptionApproval, hasImprovement };
}

// Demand number 3
function printStudentsWithSameGrade(students) {
  const courseGradeMap = {}; 
  // courseId -> grade -> [names]

  for (const student of students) {
    for (const g of student.grades) {
      const courseId = g.course;
      const gradeVal = g.grade;

      if (!courseGradeMap[courseId]) courseGradeMap[courseId] = {};
      if (!courseGradeMap[courseId][gradeVal]) courseGradeMap[courseId][gradeVal] = [];

      courseGradeMap[courseId][gradeVal].push(student.name);
    }
  }

  for (const courseId in courseGradeMap) {
    for (const gradeVal in courseGradeMap[courseId]) {
      const names = courseGradeMap[courseId][gradeVal];
      if (names.length > 1) {
        console.log(`course=${courseId}, grade=${gradeVal} -> ${names.join(", ")}`);
      }
    }
  }
}

// Demand number 4
function sortStudents(students) {
  return [...students].sort((a, b) => {
    const avgA =
      a.grades.reduce((sum, x) => sum + x.grade, 0) / a.grades.length;
    const avgB =
      b.grades.reduce((sum, x) => sum + x.grade, 0) / b.grades.length;

    // 1) average (desc)
    if (avgA !== avgB) return avgB - avgA;

    // 2) number of courses (desc)
    const countA = a.grades.length;
    const countB = b.grades.length;
    if (countA !== countB) return countB - countA;

    // 3) name (asc)
    return a.name.localeCompare(b.name);
  });
}

// Demand number 5
function getStudentsWithLowAverageOrLastGrades(students) {
  return students.filter(student => {
    const gradesArr = student.grades.map(x => x.grade);

    // average
    const average =
      gradesArr.reduce((sum, g) => sum + g, 0) / gradesArr.length;

    // condition 1: low average
    const lowAverage = average < 70;

    // if less than 2 grades, only lowAverage matters
    if (gradesArr.length < 2) return lowAverage;

    // last two grades
    const last = gradesArr[gradesArr.length - 1];
    const secondLast = gradesArr[gradesArr.length - 2];

    // condition 2: last two below average
    const lastTwoBelowAverage = last < average && secondLast < average;

    return lowAverage || lastTwoBelowAverage;
  });
}

console.log("=========== ALL TESTERS START ===========");

/* ======================
   Helpers
   ====================== */
function pass(msg) {
  console.log("✔ PASS:", msg);
}
function fail(msg) {
  console.log("✘ FAIL:", msg);
}
function test(msg, condition) {
  condition ? pass(msg) : fail(msg);
}
function expectThrow(msg, fn) {
  try {
    fn();
    fail(msg + " (should throw)");
  } catch {
    pass(msg + " (threw)");
  }
}

/* ======================
   Demand #1 – addStudent
   ====================== */
console.log("\n--- Demand #1 tests ---");

// required for demand #1
const mandatoryCourseIds = [1, 4];

// isolated array for testing
const d1Students = [
  { id: 1, name: "A", grades: { 1: 80, 4: 70 } }
];

// success
try {
  const added = addStudent(d1Students, {
    name: "New Student",
    grades: { 1: 89.6, 4: 60.2, 2: 72.9 }
  });

  test("Student added", d1Students.length === 2);
  test("ID incremented", added.id === 2);
  test(
    "Grades rounded",
    added.grades[1] === 90 &&
    added.grades[4] === 60 &&
    added.grades[2] === 73
  );
} catch (e) {
  fail("Valid addStudent crashed");
}

// errors
expectThrow(
  "Reject missing name",
  () => addStudent(d1Students, { grades: { 1: 90, 4: 80 } })
);

expectThrow(
  "Reject missing mandatory course",
  () => addStudent(d1Students, { name: "X", grades: { 1: 90 } })
);

/* ======================
   Demand #2 – getStudentStats
   ====================== */
console.log("\n--- Demand #2 tests ---");

let r = getStudentStats(101);
test("Non-existing student returns null", r === null);

r = getStudentStats(1);
console.log("Alice average =", r.average);
test("Alice average correct", Math.abs(r.average - 93.75) < 0.000001);
test("Alice no exception", r.exceptionApproval === false);
test("Alice no improvement", r.hasImprovement === false);

/* ======================
   Demand #3 – printStudentsWithSameGrade
   ====================== */
console.log("\n--- Demand #3 test ---");
console.log("Expected examples:");
console.log("course=1, grade=94 -> Hacker Man, Ivy Chen, John Long");
console.log("course=4, grade=95 -> Alice Brown, Ivy Chen");
console.log("course=4, grade=91 -> Hacker Man, John Long");
console.log("\nActual output:");

try {
  printStudentsWithSameGrade(students);
  pass("Demand #3 ran without crash");
} catch {
  fail("Demand #3 crashed");
}

/* ======================
   Demand #4 – sortStudents
   ====================== */
console.log("\n--- Demand #4 tests ---");

const sorted = sortStudents(students);
const sortedIds = sorted.map(s => s.id).join(",");

console.log("Sorted IDs:", sortedIds);
console.log("Expected: 6,1,9,10,8,2,4,7,3,5");

test(
  "Sorted correctly by rules",
  sortedIds === "6,1,9,10,8,2,4,7,3,5"
);

test(
  "Original array not changed",
  students.map(s => s.id).join(",") === "1,2,3,4,5,6,7,8,9,10"
);

/* ======================
   Demand #5 – getStudentsWithLowAverageOrLastGrades
   ====================== */
console.log("\n--- Demand #5 tests ---");

const low = getStudentsWithLowAverageOrLastGrades(students);
const lowIds = low.map(s => s.id).sort((a,b)=>a-b).join(",");

console.log("Returned IDs:", lowIds);
console.log("Expected IDs: 1,3,5,8");

test(
  "Correct students returned",
  lowIds === "1,3,5,8"
);

console.log("\n=========== ALL TESTERS END ===========");
