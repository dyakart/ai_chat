# --------------------------------------#
#  module: Logging configuration        #
# --------------------------------------#
import datetime
import logging
import os
import sys
from typing import Optional
from ai_chat.core import settings as cfg


class LineRotatingFileHandler(logging.FileHandler):
    """
    Write logs to a file, only ERROR messages.
    After max_lines lines, it creates a new file of the errors_%Y-%m-%d_%H-%M-%S.log form in the specified directory.
    """

    def __init__(self, directory: str, max_lines: int = 2500, encoding: Optional[str] = "utf-8"):
        """
        Initializes a logger with row rotation.
        - directory: directory for storing log files;
        - max_lines: maximum number of lines in one file;
        - encoding: encoding logs (utf-8 by default).

        Finds the last log file and continues to write to it, or creates a new one if the file has reached the line limit.
        """
        os.makedirs(directory, exist_ok=True)
        self.directory = directory
        self.max_lines = max_lines

        latest_path, self.lines_written = self._find_latest_file(encoding)  # Trying to find the last log file created

        if self.lines_written >= self.max_lines:  # If the file is filled, take a new name
            latest_path = self._next_filename()
            self.lines_written = 0

        super().__init__(latest_path, mode="a", encoding=encoding)

    def _next_filename(self) -> str:
        """Generates a new log file name with a timestamp (errors_DD-MM-YYYY_HH-MM-SS.log)."""
        ts = datetime.datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        return os.path.join(self.directory, f"errors_{ts}.log")

    def _rotate(self) -> None:
        """Closes the current file and opens a new one."""
        self.close()
        self.baseFilename = self._next_filename()
        self.stream = None
        self.lines_written = 0

    def _find_latest_file(self, encoding: str) -> tuple[str, int]:
        """Returns the path to the last log file and the number of lines in it."""
        files = sorted(
            (f for f in os.listdir(self.directory) if f.startswith("errors_") and f.endswith(".log")),
            reverse=True,
        )
        if not files:
            return self._next_filename(), 0

        latest = os.path.join(self.directory, files[0])

        try:
            with open(latest, "r", encoding=encoding) as fp:
                lines = sum(1 for _ in fp)
        except OSError:
            return self._next_filename(), 0  # If you can't read it, start a new one

        return latest, lines

    def emit(self, record: logging.LogRecord) -> None:
        """Writes a log entry, if the line limit is exceeded, rotates the file."""
        if self.lines_written >= self.max_lines:
            self._rotate()

        super().emit(record)
        self.lines_written += 1


def setup_logging() -> None:
    """Configures application logging."""
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    fmt = logging.Formatter(
        fmt="\n%(asctime)s [%(threadName)s] [%(funcName)s]\n%(message)s",
        datefmt="[%H:%M:%S]",
    )

    # Handler for the terminal
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(fmt)

    # Handler for file with errors
    file_handler = LineRotatingFileHandler(directory=cfg.LOG_DIR, max_lines=5000)  # max of 5000 lines
    file_handler.setLevel(logging.ERROR)
    file_handler.setFormatter(fmt)

    # Discard possible old handlers, then add our
    root_logger.handlers.clear()
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # muffle noisy loggers
    for name, level in {
        "httpx": logging.WARNING,
        "httpcore": logging.WARNING,
        "httpcore.connection": logging.WARNING,
        "httpcore.http11": logging.WARNING,
        "httpcore.http2": logging.WARNING,
        "urllib3": logging.WARNING,
    }.items():
        lg = logging.getLogger(name)
        lg.setLevel(level)
        lg.propagate = False
