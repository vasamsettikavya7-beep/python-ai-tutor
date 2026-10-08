import streamlit as st
from tutor import ask_tutor

# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="Python Buddy AI Tutor",
    page_icon="🐍",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ============================================================
# SESSION STATE
# ============================================================

if "messages" not in st.session_state:
    st.session_state.messages = []

if "history" not in st.session_state:
    st.session_state.history = []

if "xp" not in st.session_state:
    st.session_state.xp = 2400

if "streak" not in st.session_state:
    st.session_state.streak = 5

if "page" not in st.session_state:
    st.session_state.page = "Dashboard"

if "student_name" not in st.session_state:
    st.session_state.student_name = "Student"

if "level" not in st.session_state:
    st.session_state.level = "Beginner"

if "difficulty" not in st.session_state:
    st.session_state.difficulty = "Easy"

if "topic" not in st.session_state:
    st.session_state.topic = "Python Basics"

if "mode" not in st.session_state:
    st.session_state.mode = "Learn"


# ============================================================
# NAVIGATION
# ============================================================

def navigate(page, mode=None):
    st.session_state.page = page

    if mode:
        st.session_state.mode = mode

    st.rerun()


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown(
    """
<style>

/* ==========================================================
   GLOBAL
   ========================================================== */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: "Inter", sans-serif;
}

.stApp {
    background: #f7f5fb;
}

.main .block-container {
    max-width: 1450px;
    padding: 30px 38px 50px 38px;
}

#MainMenu {
    visibility: hidden;
}

footer {
    visibility: hidden;
}

header {
    background: transparent !important;
}

/* ==========================================================
   SIDEBAR
   ========================================================== */

section[data-testid="stSidebar"] {
    background: #5a43c2;
    min-width: 240px;
    max-width: 240px;
}

section[data-testid="stSidebar"] > div {
    padding: 18px 12px;
}

section[data-testid="stSidebar"] .stButton > button {
    width: 100%;
    border: none;
    border-radius: 13px;
    background: transparent;
    color: white !important;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    min-height: 44px;
    margin: 3px 0;
}

section[data-testid="stSidebar"] .stButton > button:hover {
    background: rgba(255,255,255,0.14);
    color: white !important;
}

.brand {
    color: white;
    font-family: "Poppins", sans-serif;
    font-size: 23px;
    font-weight: 800;
    text-align: center;
    padding: 8px 5px 28px 5px;
}

.menu-title {
    color: rgba(255,255,255,0.55);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.3px;
    padding: 5px 10px 8px 10px;
}

.sidebar-message {
    color: white;
    background: rgba(255,255,255,0.11);
    border-radius: 15px;
    padding: 15px;
    margin: 25px 4px;
    font-size: 11px;
    line-height: 1.6;
}

/* ==========================================================
   HEADINGS
   ========================================================== */

.welcome-title {
    font-family: "Poppins", sans-serif;
    color: #17142d;
    font-size: 34px;
    font-weight: 700;
    line-height: 1.15;
}

.welcome-name {
    font-weight: 400;
}

.subtitle {
    color: #8e899b;
    font-size: 13px;
    line-height: 1.6;
    margin-top: 8px;
    margin-bottom: 22px;
}

.section-title {
    color: #211d35;
    font-family: "Poppins", sans-serif;
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 10px;
}

.page-title {
    color: #17142d;
    font-family: "Poppins", sans-serif;
    font-size: 30px;
    font-weight: 700;
}

.page-subtitle {
    color: #8e899b;
    font-size: 12px;
    margin-bottom: 24px;
}

/* ==========================================================
   STREAMLIT CONTAINER CARDS
   ========================================================== */

div[data-testid="stVerticalBlockBorderWrapper"] {
    background: white;
    border: 1px solid #efebf6;
    border-radius: 22px;
    box-shadow: 0 8px 28px rgba(70, 50, 130, 0.055);
}

/* ==========================================================
   METRICS
   ========================================================== */

div[data-testid="stMetric"] {
    background: #faf9ff;
    border-radius: 15px;
    padding: 12px;
}

div[data-testid="stMetricLabel"] {
    color: #9995a5 !important;
    font-size: 10px !important;
}

div[data-testid="stMetricValue"] {
    color: #5a43c2 !important;
    font-size: 22px !important;
    font-weight: 800 !important;
}

/* ==========================================================
   BUTTONS
   ========================================================== */

.stButton > button {
    border-radius: 12px;
    border: 1px solid #ddd8eb;
    background: white;
    color: #332e4b;
    font-weight: 600;
    min-height: 40px;
}

.stButton > button:hover {
    border-color: #5a43c2;
    color: #5a43c2;
}

/* ==========================================================
   SELECTBOX / INPUT
   ========================================================== */

div[data-baseweb="select"] > div {
    border-radius: 12px !important;
    border-color: #e4e0ed !important;
    background: white !important;
}

.stTextInput input {
    border-radius: 12px !important;
}

/* ==========================================================
   CHAT
   ========================================================== */

div[data-testid="stChatMessage"] {
    border-radius: 16px;
}

/* ==========================================================
   PROGRESS
   ========================================================== */

div[data-testid="stProgress"] > div {
    background: #ece9f5;
    border-radius: 20px;
}

div[data-testid="stProgress"] > div > div {
    background: #55bd79;
    border-radius: 20px;
}

/* ==========================================================
   INFO / SUCCESS
   ========================================================== */

div[data-testid="stAlert"] {
    border-radius: 15px;
}

/* ==========================================================
   HIDE EMPTY LABEL SPACING
   ========================================================== */

.compact-label {
    color: #9995a5;
    font-size: 11px;
}

.big-purple {
    color: #5a43c2;
    font-family: "Poppins", sans-serif;
    font-size: 27px;
    font-weight: 800;
}

.big-green {
    color: #45b86b;
    font-size: 24px;
    font-weight: 800;
}

.emoji-large {
    font-size: 38px;
}

</style>
""",
    unsafe_allow_html=True,
)


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    st.markdown(
        '<div class="brand">🐍 Python Buddy</div>',
        unsafe_allow_html=True,
    )

    st.markdown(
        '<div class="menu-title">MAIN MENU</div>',
        unsafe_allow_html=True,
    )

    if st.button("🏠  Dashboard", key="sidebar_dashboard"):
        navigate("Dashboard")

    if st.button("📚  Learn", key="sidebar_learn"):
        navigate("Tutor", "Learn")

    if st.button("✏️  Practice", key="sidebar_practice"):
        navigate("Tutor", "Practice")

    if st.button("🧠  Quiz", key="sidebar_quiz"):
        navigate("Tutor", "Quiz")

    if st.button("📊  My Progress", key="sidebar_progress"):
        navigate("Progress")

    if st.button("🏆  Achievements", key="sidebar_achievements"):
        navigate("Achievements")

    if st.button("⚙️  Settings", key="sidebar_settings"):
        navigate("Settings")

    st.markdown(
        """
        <div class="sidebar-message">
            🚀 <b>Keep learning!</b><br><br>
            Every Python question you answer helps you
            become a stronger programmer.
        </div>
        """,
        unsafe_allow_html=True,
    )


# ============================================================
# DASHBOARD
# ============================================================

def dashboard():

    name = st.session_state.student_name

    st.markdown(
        f"""
        <div class="welcome-title">
            Hello, <span class="welcome-name">{name}</span> 👋
        </div>

        <div class="subtitle">
            Nice to have you back! What an exciting day!<br>
            Get ready and continue your Python learning journey.
        </div>
        """,
        unsafe_allow_html=True,
    )

    # --------------------------------------------------------
    # TOP CARDS
    # --------------------------------------------------------

    col1, col2, col3 = st.columns(
        [1.25, 0.85, 0.9],
        gap="medium",
    )

    with col1:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">Today\'s Learning</div>',
                unsafe_allow_html=True,
            )

            st.info("🐍  Python Basics")

            st.caption("📖 12 lessons     ⏱️ 45 min")

            st.markdown(
                '<div class="big-green">79%</div>',
                unsafe_allow_html=True,
            )

            st.progress(0.79)

            st.divider()

            st.info("📦  Variables & Data Types")

            st.caption("📖 8 lessons     ⏱️ 30 min")

            st.markdown(
                '<div class="big-green">64%</div>',
                unsafe_allow_html=True,
            )

            st.progress(0.64)

    with col2:

        with st.container(border=True):

            st.markdown(
                '<div style="text-align:center;">'
                '<div class="emoji-large">🧑‍💻</div>'
                '</div>',
                unsafe_allow_html=True,
            )

            st.markdown(
                f"""
                <div style="text-align:center;">
                    <div style="
                        color:#27233d;
                        font-family:Poppins,sans-serif;
                        font-size:17px;
                        font-weight:700;
                    ">
                        {name}
                    </div>

                    <div class="compact-label">
                        {st.session_state.level} Python Learner
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

            st.metric(
                "Questions Asked",
                len(st.session_state.history),
            )

            st.metric(
                "Day Streak 🔥",
                st.session_state.streak,
            )

    with col3:

        with st.container(border=True):

            st.markdown(
                '<div class="big-purple">'
                f'{st.session_state.xp:,} XP'
                '</div>',
                unsafe_allow_html=True,
            )

            st.caption("Learning Points")

            st.markdown(
                '<div style="font-size:45px;text-align:center;">🏅</div>',
                unsafe_allow_html=True,
            )

            st.caption("Next milestone: 2,500 XP")

            st.progress(
                min(st.session_state.xp / 2500, 1.0)
            )

        st.write("")

        with st.container(border=True):

            st.markdown(
                '<div class="emoji-large">🎯</div>',
                unsafe_allow_html=True,
            )

            st.markdown(
                '<b>Set Your Goal</b>',
                unsafe_allow_html=True,
            )

            st.caption(
                "Choose a Python topic and build your learning goal."
            )

            if st.button(
                "Set Goal",
                key="goal_button",
                use_container_width=True,
            ):
                navigate("Tutor", "Learn")

    # --------------------------------------------------------
    # START LEARNING
    # --------------------------------------------------------

    st.write("")

    st.markdown(
        '<div class="section-title">Start Learning</div>',
        unsafe_allow_html=True,
    )

    a1, a2, a3, a4 = st.columns(4, gap="medium")

    with a1:
        with st.container(border=True):
            st.markdown("### 📚")
            st.markdown("**Learn**")
            st.caption(
                "Understand Python concepts with simple explanations."
            )

            if st.button(
                "Start Learning",
                key="learn_button",
                use_container_width=True,
            ):
                navigate("Tutor", "Learn")

    with a2:
        with st.container(border=True):
            st.markdown("### ✏️")
            st.markdown("**Practice**")
            st.caption(
                "Practice Python problems generated for your level."
            )

            if st.button(
                "Start Practice",
                key="practice_button",
                use_container_width=True,
            ):
                navigate("Tutor", "Practice")

    with a3:
        with st.container(border=True):
            st.markdown("### 🧠")
            st.markdown("**Quiz**")
            st.caption(
                "Test your Python knowledge with AI quizzes."
            )

            if st.button(
                "Start Quiz",
                key="quiz_button",
                use_container_width=True,
            ):
                navigate("Tutor", "Quiz")

    with a4:
        with st.container(border=True):
            st.markdown("### 📊")
            st.markdown("**My Progress**")
            st.caption(
                "Track your learning performance and growth."
            )

            if st.button(
                "View Progress",
                key="progress_button",
                use_container_width=True,
            ):
                navigate("Progress")

    # --------------------------------------------------------
    # TOPICS + ACTIVITY
    # --------------------------------------------------------

    st.write("")

    left, right = st.columns(
        [0.95, 1.55],
        gap="medium",
    )

    with left:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">🐍 Python Topics</div>',
                unsafe_allow_html=True,
            )

            st.caption(
                "Choose a topic to start learning."
            )

            topics = [
                "Python Basics",
                "Variables",
                "Data Types",
                "Strings",
                "Lists",
                "Tuples",
                "Dictionaries",
                "If / Else",
                "Loops",
                "Functions",
                "Object Oriented Programming",
                "Exception Handling",
                "File Handling",
            ]

            current_index = topics.index(
                st.session_state.topic
            )

            selected = st.selectbox(
                "Python Topic",
                topics,
                index=current_index,
                label_visibility="collapsed",
                key="dashboard_topic_select",
            )

            st.session_state.topic = selected

            st.info(
                f"🐍 {selected}\n\n"
                f"Recommended for {st.session_state.level} learners."
            )

            if st.button(
                "🚀 Start This Topic",
                key="start_topic",
                use_container_width=True,
            ):
                navigate("Tutor", "Learn")

    with right:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">📈 Learning Activity</div>',
                unsafe_allow_html=True,
            )

            st.caption(
                "Your current Python learning progress."
            )

            st.progress(0.79)

            p1, p2, p3, p4 = st.columns(4)

            with p1:
                st.metric("Progress", "79%")

            with p2:
                st.metric("Topics", "13")

            with p3:
                st.metric(
                    "Questions",
                    len(st.session_state.history),
                )

            with p4:
                st.metric(
                    "Streak",
                    st.session_state.streak,
                )

    # --------------------------------------------------------
    # AI TUTOR PREVIEW
    # --------------------------------------------------------

    st.write("")

    with st.container(border=True):

        st.markdown(
            '<div class="section-title">'
            '🤖 Python Buddy AI Tutor'
            '</div>',
            unsafe_allow_html=True,
        )

        st.caption(
            "Ask questions, practice Python, get hints and receive "
            "personalized feedback."
        )

        if st.button(
            "💬 Ask Python Buddy",
            key="ask_python_buddy",
            use_container_width=True,
        ):
            navigate("Tutor", "Learn")


# ============================================================
# TUTOR PAGE
# ============================================================

def tutor_page():

    st.markdown(
        '<div class="page-title">🤖 Python Buddy AI Tutor</div>',
        unsafe_allow_html=True,
    )

    st.markdown(
        '<div class="page-subtitle">'
        'Your personal Python teacher — learn, practice, quiz and improve.'
        '</div>',
        unsafe_allow_html=True,
    )

    settings, chat = st.columns(
        [0.7, 1.6],
        gap="medium",
    )

    with settings:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">🎯 Learning Setup</div>',
                unsafe_allow_html=True,
            )

            modes = [
                "Learn",
                "Practice",
                "Quiz",
                "Evaluate Answer",
                "Recommendation",
            ]

            st.session_state.mode = st.selectbox(
                "Mode",
                modes,
                index=modes.index(
                    st.session_state.mode
                ),
            )

            topics = [
                "Python Basics",
                "Variables",
                "Data Types",
                "Strings",
                "Lists",
                "Tuples",
                "Dictionaries",
                "If / Else",
                "Loops",
                "Functions",
                "Object Oriented Programming",
                "Exception Handling",
                "File Handling",
            ]

            st.session_state.topic = st.selectbox(
                "Topic",
                topics,
                index=topics.index(
                    st.session_state.topic
                ),
            )

            levels = [
                "Beginner",
                "Intermediate",
                "Advanced",
            ]

            st.session_state.level = st.selectbox(
                "Level",
                levels,
                index=levels.index(
                    st.session_state.level
                ),
            )

            difficulties = [
                "Easy",
                "Medium",
                "Hard",
            ]

            st.session_state.difficulty = st.selectbox(
                "Difficulty",
                difficulties,
                index=difficulties.index(
                    st.session_state.difficulty
                ),
            )

            st.divider()

            st.markdown(
                f"""
                **Selected Topic**

                🐍 {st.session_state.topic}

                **Mode**

                {st.session_state.mode}

                **Difficulty**

                {st.session_state.difficulty}
                """
            )

            if st.button(
                "🏠 Dashboard",
                key="tutor_dashboard",
                use_container_width=True,
            ):
                navigate("Dashboard")

            if st.button(
                "🗑️ Clear Chat",
                key="clear_chat",
                use_container_width=True,
            ):
                st.session_state.messages = []
                st.session_state.history = []
                st.rerun()

    with chat:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">🐍 Python Buddy</div>',
                unsafe_allow_html=True,
            )

            st.caption(
                "Ask your question below. Python Buddy will adapt "
                "to your level and selected mode."
            )

            for message in st.session_state.messages:

                with st.chat_message(
                    message["role"]
                ):
                    st.markdown(
                        message["content"]
                    )

            user_input = st.chat_input(
                f"Ask Python Buddy about "
                f"{st.session_state.topic}..."
            )

            if user_input:

                st.session_state.messages.append(
                    {
                        "role": "user",
                        "content": user_input,
                    }
                )

                with st.chat_message("user"):
                    st.markdown(user_input)

                with st.chat_message("assistant"):

                    with st.spinner(
                        "🐍 Python Buddy is thinking..."
                    ):

                        try:

                            answer = ask_tutor(
                                student_name=(
                                    st.session_state.student_name
                                ),
                                level=(
                                    st.session_state.level
                                ),
                                difficulty=(
                                    st.session_state.difficulty
                                ),
                                mode=(
                                    st.session_state.mode
                                ),
                                topic=(
                                    st.session_state.topic
                                ),
                                question=user_input,
                                history=(
                                    st.session_state.history
                                ),
                            )

                            st.markdown(answer)

                            st.session_state.xp += 25

                        except Exception as error:

                            answer = (
                                "I couldn't connect to Gemini "
                                "right now. Please check your "
                                "Gemini API connection."
                            )

                            st.error(
                                f"Gemini Error: {error}"
                            )

                st.session_state.messages.append(
                    {
                        "role": "assistant",
                        "content": answer,
                    }
                )

                st.session_state.history.append(
                    {
                        "student": user_input,
                        "tutor": answer,
                        "topic": st.session_state.topic,
                        "mode": st.session_state.mode,
                    }
                )


# ============================================================
# PROGRESS PAGE
# ============================================================

def progress_page():

    st.markdown(
        '<div class="page-title">📊 My Progress</div>',
        unsafe_allow_html=True,
    )

    st.markdown(
        '<div class="page-subtitle">'
        'See how your Python learning journey is progressing.'
        '</div>',
        unsafe_allow_html=True,
    )

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric(
            "🐍 Questions",
            len(st.session_state.history),
        )

    with c2:
        st.metric(
            "⭐ XP",
            f"{st.session_state.xp:,}",
        )

    with c3:
        st.metric(
            "🔥 Streak",
            st.session_state.streak,
        )

    with c4:
        st.metric(
            "📚 Topics",
            13,
        )

    st.write("")

    left, right = st.columns(2)

    with left:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">'
                'Learning Progress'
                '</div>',
                unsafe_allow_html=True,
            )

            st.progress(0.79)

            st.markdown(
                "**79%** overall learning progress"
            )

            st.info(
                "🐍 Python Basics — 79%"
            )

            st.info(
                "📦 Variables & Data Types — 64%"
            )

    with right:

        with st.container(border=True):

            st.markdown(
                '<div class="section-title">'
                '💡 Learning Recommendation'
                '</div>',
                unsafe_allow_html=True,
            )

            st.info(
                "Next lesson: Loops"
            )

            st.caption(
                "Practice for-loops and while-loops "
                "with small coding problems."
            )

            st.info(
                "Suggested activity"
            )

            st.caption(
                "Complete 5 beginner Python practice questions."
            )

    st.write("")

    if st.button(
        "🏠 Back to Dashboard",
        use_container_width=True,
    ):
        navigate("Dashboard")


# ============================================================
# ACHIEVEMENTS PAGE
# ============================================================

def achievements_page():

    st.markdown(
        '<div class="page-title">🏆 Achievements</div>',
        unsafe_allow_html=True,
    )

    st.markdown(
        '<div class="page-subtitle">'
        'Celebrate your Python learning milestones.'
        '</div>',
        unsafe_allow_html=True,
    )

    a1, a2, a3, a4 = st.columns(4)

    achievements = [
        ("🌱", "First Step", "Started your Python journey"),
        ("🔥", "5 Day Streak", "Learned for five days"),
        ("⭐", "XP Explorer", "Earned 2,400 XP"),
        ("🐍", "Python Learner", "Started learning Python"),
    ]

    for col, achievement in zip(
        [a1, a2, a3, a4],
        achievements,
    ):

        icon, title, description = achievement

        with col:

            with st.container(border=True):

                st.markdown(
                    f"""
                    <div style="text-align:center;">
                        <div style="font-size:40px;">
                            {icon}
                        </div>

                        <div style="
                            color:#29253f;
                            font-family:Poppins,sans-serif;
                            font-size:14px;
                            font-weight:700;
                            margin-top:8px;
                        ">
                            {title}
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                st.caption(
                    description
                )

    st.write("")

    with st.container(border=True):

        st.markdown(
            '<div class="section-title">⭐ Your XP</div>',
            unsafe_allow_html=True,
        )

        st.markdown(
            f'<div class="big-purple">'
            f'{st.session_state.xp:,} XP'
            f'</div>',
            unsafe_allow_html=True,
        )

        st.caption(
            "Keep learning to unlock more achievements."
        )


# ============================================================
# SETTINGS PAGE
# ============================================================

def settings_page():

    st.markdown(
        '<div class="page-title">⚙️ Settings</div>',
        unsafe_allow_html=True,
    )

    st.markdown(
        '<div class="page-subtitle">'
        'Personalize your Python Buddy learning experience.'
        '</div>',
        unsafe_allow_html=True,
    )

    with st.container(border=True):

        st.markdown(
            '<div class="section-title">'
            '👤 Learner Profile'
            '</div>',
            unsafe_allow_html=True,
        )

        name = st.text_input(
            "Your Name",
            value=st.session_state.student_name,
        )

        levels = [
            "Beginner",
            "Intermediate",
            "Advanced",
        ]

        level = st.selectbox(
            "Current Level",
            levels,
            index=levels.index(
                st.session_state.level
            ),
        )

        difficulties = [
            "Easy",
            "Medium",
            "Hard",
        ]

        difficulty = st.selectbox(
            "Preferred Difficulty",
            difficulties,
            index=difficulties.index(
                st.session_state.difficulty
            ),
        )

        if st.button(
            "💾 Save Profile",
            use_container_width=True,
        ):

            st.session_state.student_name = (
                name.strip() or "Student"
            )

            st.session_state.level = level
            st.session_state.difficulty = difficulty

            st.success(
                "Profile updated successfully! 🎉"
            )

    st.write("")

    if st.button(
        "🏠 Back to Dashboard",
        use_container_width=True,
    ):
        navigate("Dashboard")


# ============================================================
# ROUTER
# ============================================================

if st.session_state.page == "Dashboard":
    dashboard()

elif st.session_state.page == "Tutor":
    tutor_page()

elif st.session_state.page == "Progress":
    progress_page()

elif st.session_state.page == "Achievements":
    achievements_page()

elif st.session_state.page == "Settings":
    settings_page()


# ============================================================
# FOOTER
# ============================================================

st.markdown(
    """
    <div style="
        text-align:center;
        color:#aaa6b5;
        font-size:10px;
        padding:28px 0 5px 0;
    ">
        🐍 Python Buddy AI Tutor
        &nbsp;•&nbsp;
        Learn • Practice • Quiz • Grow
    </div>
    """,
    unsafe_allow_html=True,
)
