package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

func SendSuccess(c *gin.Context, httpStatus int, message string, data interface{}) {
	c.JSON(httpStatus, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func SendError(c *gin.Context, httpStatus int, message string, errDetails interface{}) {
	var detail interface{}
	if err, ok := errDetails.(error); ok {
		detail = err.Error()
	} else {
		detail = errDetails
	}

	c.JSON(httpStatus, APIResponse{
		Success: false,
		Message: message,
		Error:   detail,
	})
}

func SendBadRequest(c *gin.Context, message string, errDetails interface{}) {
	SendError(c, http.StatusBadRequest, message, errDetails)
}

func SendUnauthorized(c *gin.Context, message string) {
	SendError(c, http.StatusUnauthorized, message, "Unauthorized access")
}

func SendNotFound(c *gin.Context, message string) {
	SendError(c, http.StatusNotFound, message, "Resource not found")
}

func SendInternalServerError(c *gin.Context, message string, errDetails interface{}) {
	SendError(c, http.StatusInternalServerError, message, errDetails)
}
