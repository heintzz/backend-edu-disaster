const pool = require('../../config/db');
const soal = require('../../utils/soal');

const getStudentsByTeacherId = async (req, res) => {
  const classId = req.query.class_id;
  const searchQuery = req.query.search;

  const values = [req.userId];

  let getStudentsQuery = `
      SELECT u.id, u.name, u.email
      FROM users u
      JOIN students_classes sc
      ON u.id = sc.student_id
      JOIN classes c
      ON sc.class_id = c.id
      WHERE c.teacher_id = $1
      `;

  if (classId) {
    getStudentsQuery += ` AND c.id = $${values.length + 1}`;
    values.push(classId);
  }

  if (searchQuery) {
    getStudentsQuery += ` AND (u.name ILIKE $${values.length + 1} OR u.email ILIKE $${
      values.length + 1
    })`;
    values.push(`%${searchQuery}%`);
  }

  try {
    const { rows } = await pool.query(getStudentsQuery, [...values]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getStudentProgress = async (req, res) => {
  const studentId = req.params.studentId;

  const getProgressQuery = `
    SELECT lesson_id, completion_date
    FROM progress
    WHERE student_id = $1
  `;

  try {
    const { rows } = await pool.query(getProgressQuery, [studentId]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getStudentEvaluations = async (req, res) => {
  const studentId = req.params.studentId;

  const getEvaluationsQuery = `
    SELECT score, is_completed, answers
    FROM evaluations
    WHERE student_id = $1
  `;

  try {
    const { rows } = await pool.query(getEvaluationsQuery, [studentId]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getStudentStatistics = async (req, res) => {
  const userId = req.userId;
  const classId = req.query.classId;

  const values = [userId];

  let getProgressQuery = `
    SELECT u.name, CAST(COUNT(DISTINCT p.lesson_id) AS INTEGER) AS total_lessons
    FROM users u 
    JOIN students_classes sc
    ON u.id = sc.student_id
    JOIN classes c
    ON sc.class_id = c.id
    JOIN progress p
    ON u.id = p.student_id   
    WHERE c.teacher_id = $1
    GROUP BY u.name
  `;

  let getEvaluationsQuery = `
    SELECT u.name, e.score
    FROM users u 
    JOIN students_classes sc
    ON u.id = sc.student_id
    JOIN classes c
    ON sc.class_id = c.id
    LEFT JOIN evaluations e
    ON u.id = e.student_id
    WHERE c.teacher_id = $1
  `;

  if (classId) {
    getOverallStatisticsQuery += ` AND c.id = $${values.length + 1}`;
    getEvaluationsQuery += ` AND c.id = $${values.length + 1}`;
    values.push(classId);
  }

  try {
    const { rows: rowsProgress } = await pool.query(getProgressQuery, [...values]);

    const totalLessons = rowsProgress.reduce(
      (prev, curr) => {
        prev.long += 1;
        prev.count += curr.total_lessons;
        return prev;
      },
      { long: 0, count: 0 }
    );

    const learningProgress = (totalLessons.count / (totalLessons.long * 12)) * 100;

    const { rows: rowsEvaluations } = await pool.query(getEvaluationsQuery, [...values]);

    const totalScores = rowsEvaluations.reduce(
      (prev, curr) => {
        if (curr.score !== null) {
          prev.scores += curr.score;
          prev.long += 1;
        }
        return prev;
      },
      { long: 0, scores: 0 }
    );

    res.status(200).send({
      success: true,
      data: {
        lesson_progress: Math.floor(learningProgress),
        evaluation_accuracy: Math.floor(totalScores.scores / totalScores.long),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getAnswerStatistics = async (req, res) => {
  const userId = req.userId;
  const classId = req.query.classId;

  const values = [userId];

  let getEvaluationsQuery = `
    SELECT u.name, e.answers
    FROM users u 
    JOIN students_classes sc
    ON u.id = sc.student_id
    JOIN classes c
    ON sc.class_id = c.id
    LEFT JOIN evaluations e
    ON u.id = e.student_id
    WHERE c.teacher_id = $1
  `;

  if (classId) {
    getEvaluationsQuery += ` AND c.id = $${values.length + 1}`;
    values.push(classId);
  }

  try {
    const { rows } = await pool.query(getEvaluationsQuery, [...values]);
    const studentAnswers = rows.map((row) => row.answers).filter((answer) => answer !== null);
    const answers = studentAnswers.reduce((prev, curr) => {
      curr.data.forEach((item) => {
        const questionIndex = item.no - 1;
        const userAnswer = item.answer.toUpperCase();
        const correctAnswer = soal[questionIndex].correctAnswer;

        if (userAnswer === correctAnswer) {
          if (!prev[questionIndex]) {
            prev[questionIndex] = 0;
          }
          prev[questionIndex] += 1;
        } else {
          prev[questionIndex] = 0;
        }
      });

      return prev;
    }, {});

    res.status(200).send({
      success: true,
      data: {
        correct_answer: Object.values(answers),
        incorrect_answer: Object.values(answers).map((value) => studentAnswers.length - value),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getStudentNotes = async (req, res) => {
  const studentId = req.params.studentId;

  const getNotesQuery = `
    SELECT id, content
    FROM notes
    WHERE student_id = $1
  `;

  try {
    const { rows } = await pool.query(getNotesQuery, [studentId]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const createStudentNote = async (req, res) => {
  const studentId = req.params.studentId;
  const { content } = req.body;

  const addNoteQuery = `
    INSERT INTO notes (student_id, content)
    VALUES ($1, $2)
  `;

  try {
    await pool.query(addNoteQuery, [studentId, content]);
    res.status(201).send({
      success: true,
      message: 'note added successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'internal server error',
    });
  }
};

const deleteStudentNote = async (req, res) => {
  const studentId = req.params.studentId;
  const noteId = req.params.noteId;

  const deleteStudentNoteQuery = `
    DELETE FROM notes 
    WHERE student_id = $1 AND id = $2
  `;

  try {
    await pool.query(deleteStudentNoteQuery, [studentId, noteId]);
    res.status(200).send({
      success: true,
      message: 'note deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
    });
  }
};

const TeacherStudentController = {
  getStudentsByTeacherId,
  getStudentProgress,
  getStudentEvaluations,
  getStudentStatistics,
  getAnswerStatistics,
  getStudentNotes,
  createStudentNote,
  deleteStudentNote,
};

module.exports = TeacherStudentController;
